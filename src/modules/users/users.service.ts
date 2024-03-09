import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from './enums/role.enum';
import { UserRepositoryInterface } from './interfaces/user.interface';
import { BaseServiceAbstract } from 'src/abstracts/base/base.service.abstract';

@Injectable()
export class UsersService extends BaseServiceAbstract<User>{
    constructor(
        @Inject('UsersRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,
    ) {
        super(userRepository);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new NotFoundException('User with this email does not exist');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(registerDto: RegisterDto): Promise<User> {
        try {
            const userInDb = await this.userRepository.findByEmail(registerDto.email);
            if (userInDb) {
                throw new BadRequestException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newUser = await this.userRepository.create({
                ...registerDto,
                password: hashedPassword,
                roles: [Role.CUSTOMER]
            });
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
