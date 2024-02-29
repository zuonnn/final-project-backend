import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { KeyTokensService } from 'src/key-tokens/key-tokens.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { KeyToken } from 'src/key-tokens/schemas/key-token.schema';

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
                userId: newUser._id,
                publicKey,
                privateKey,
                refreshToken: '',
            });
            if (!keyStore) {
                throw new Error('Error saving key token');
            }

            const tokens = await this.keyTokensService.createTokenPair({ userId: newUser._id, email: newUser.email }, publicKey, privateKey);

            return {
                metadata: {
                    newUser,
                    tokens
                }
            };
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const match = await bcrypt.compare(loginDto.password, user.password);
        if (!match) {
            throw new UnauthorizedException();
        }

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId, roles: roles } = user;

        const tokens = await this.keyTokensService.createTokenPair({ userId, roles }, publicKey, privateKey);

        await this.keyTokensService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            metadata: {
                userId,
                roles,
                tokens
            }
        };
    }

    async logout(keyStore: KeyToken) {
        const delKey = await this.keyTokensService.removeKeyById(keyStore._id);
        return delKey;
    }

}
