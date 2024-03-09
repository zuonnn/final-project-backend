import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new NotFoundException('User with this email does not exist');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findById(id: string): Promise<User | undefined> {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new NotFoundException('User with this id does not exist');
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(registerDto: RegisterDto): Promise<User> {
        try {
            const userInDb = await this.userModel.findOne({ email: registerDto.email });
            if (userInDb) {
                throw new BadRequestException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newUser = new this.userModel({
                ...registerDto,
                password: hashedPassword,
                roles: [Role.CUSTOMER]
            });
            return newUser.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
