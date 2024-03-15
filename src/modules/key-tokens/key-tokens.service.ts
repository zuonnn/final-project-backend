import { Injectable } from '@nestjs/common';
import { CreateKeyTokenDto } from './dto/create-key-token.dto';
import { KeyToken } from './entities/key-token.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class KeyTokensService {
  constructor(
    @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>,
    private jwtService: JwtService
  ) { }

  async createKeyToken(createKeyTokenDto: CreateKeyTokenDto): Promise<string | null> {
    try {
      const filter = { user: createKeyTokenDto.user_id };
      const update = {
        publicKey: createKeyTokenDto.publicKey,
        privateKey: createKeyTokenDto.privateKey,
        refresh_token_used: [],
        refresh_token: createKeyTokenDto.refresh_token
      };
      const options = { upsert: true, new: true };
      const tokens = await this.keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw new Error('Error creating key token: ' + error.message);
    }
  }

  async createTokenPair(payload: object, publicKey: string, privateKey: string) {
    try {
      const accessToken = this.jwtService.sign(payload, { secret: publicKey, expiresIn: '1h' });
      const refresh_token = this.jwtService.sign(payload, { secret: privateKey, expiresIn: '7d' });
      return { accessToken, refresh_token };
    } catch (error) {
      throw new Error('Error creating token pair: ' + error.message);
    }
  }

  async findByuser_id(user_id: ObjectId): Promise<KeyToken | null> {
    return await this.keyTokenModel.findOne({ user: user_id });
  }

  async removeKeyById(id: string) {
    return await this.keyTokenModel.findByIdAndDelete(id);
  }
}
