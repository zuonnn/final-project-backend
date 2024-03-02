import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { KeyTokensModule } from './key-tokens/key-tokens.module';
import { ProductsModule } from './products/products.module';
import { DiscountsModule } from './discounts/discounts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        maxPoolSize: 50
      }),
      inject: [ConfigService],
    }),
    MorganModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]), 
    AuthModule, UsersModule, KeyTokensModule, ProductsModule, DiscountsModule

  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ]
})
export class AppModule {}
