import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { UsersModule } from '../users/users.module';
import { KeyTokensModule } from '../key-tokens/key-tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UsersModule, 
    KeyTokensModule,
    JwtModule
  ],
})
export class AuthModule {}