import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { KeyTokensService } from '../key-tokens/key-tokens.service';
import { KeyToken } from '../key-tokens/entities/key-token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly keyTokensService: KeyTokensService
    ) { }

    async register(registerDto: RegisterDto) {
        try {
            const newUser = await this.usersService.create(registerDto);
            if (!newUser) {
                throw new Error('Error creating user');
            }

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            const keyStore = await this.keyTokensService.createKeyToken({
                user_id: newUser._id,
                publicKey,
                privateKey,
                refresh_token: '',
            });
            if (!keyStore) {
                throw new Error('Error saving key token');
            }

            const tokens = await this.keyTokensService.createTokenPair({ user_id: newUser._id, email: newUser.email }, publicKey, privateKey);

            return {
                metadata: {
                    newUser,
                    tokens
                }
            };
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException();
        }
        console.log(user.password);
        console.log(loginDto.password);
        const match = await bcrypt.compare(loginDto.password, user.password);
        if (!match) {
            throw new UnauthorizedException();
        }

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const { _id: user_id, roles: roles } = user;

        const tokens = await this.keyTokensService.createTokenPair({ user_id, roles }, publicKey, privateKey);

        await this.keyTokensService.createKeyToken({
            user_id,
            publicKey,
            privateKey,
            refresh_token: tokens.refresh_token
        });

        return {
            metadata: {
                user_id,
                roles,
                tokens
            }
        };
    }

    async logout(keyStore: KeyToken) {
        const delKey = await this.keyTokensService.removeKeyById(keyStore._id);
        console.log(delKey);
        return delKey;
    }
}
