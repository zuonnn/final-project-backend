import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { KeyTokensModule } from './modules/key-tokens/key-tokens.module';
import { ProductsModule } from './modules/products/products.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { CartsModule } from './modules/carts/carts.module';
import { CheckoutsModule } from './modules/checkouts/checkouts.module';
import { RedisModule } from './modules/redis/redis.module';

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
    AuthModule, UsersModule, KeyTokensModule, ProductsModule, DiscountsModule, CartsModule, CheckoutsModule, RedisModule,
    

  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ]
})
export class AppModule {}
