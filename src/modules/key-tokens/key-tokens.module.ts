import { Module } from '@nestjs/common';
import { KeyTokensService } from './key-tokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema } from './entities/key-token.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [KeyTokensService],
  imports: [
    MongooseModule.forFeature([{ name: KeyToken.name, schema: KeyTokenSchema }]),
    JwtModule
  ],
  exports: [KeyTokensService]
})
export class KeyTokensModule {}
