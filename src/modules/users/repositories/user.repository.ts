import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepositoryInterface } from 'src/modules/users/interfaces/user.interface';

@Injectable()
export class UsersRepository
    extends BaseRepositoryAbstract<User>
    implements UserRepositoryInterface
{
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        super(userModel);
    }

    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email}).exec();
    }
}
