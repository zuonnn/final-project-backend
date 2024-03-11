import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, { provide: 'UsersRepositoryInterface', useClass: UsersRepository }],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [UsersService]
})
export class UsersModule { }
