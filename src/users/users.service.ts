import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findById(id: string): Promise<User | undefined> {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(registerDto: RegisterDto): Promise<User> {
        try {
            const userInDb = await this.userModel.findOne({ email: registerDto.email });
            if (userInDb) {
                throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const newUser = new this.userModel({
                ...registerDto,
                password: hashedPassword,
                roles: [Role.CUSTOMER]
            });
            return newUser.save();
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}