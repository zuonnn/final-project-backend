import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { KeyToken } from 'src/modules/key-tokens/entities/key-token.entity';
import { KeyTokensService } from 'src/modules/key-tokens/key-tokens.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private keysTokenService: KeyTokensService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request: Request, rawJwtToken: string, done: (err: any, secretOrKey?: string) => void) => {
        const userId = request.headers['x-client-id'];
        if (!userId) {
          return done(new UnauthorizedException(), null);
        }

        let keyStore: KeyToken;
        try {
          keyStore = await this.keysTokenService.findByUserId(userId);
          if (!keyStore) {
            return done(new UnauthorizedException('Key store not found for user.'), null);
          }
          request['keyStore'] = keyStore;
        } catch (error) {
          return done(new UnauthorizedException('Error fetching key store.'), null);
        }

        done(null, keyStore.publicKey);
      },
    });
  }

  async validate(payload: any, request: Request) {
    return { userId: payload.userId, roles: payload.roles };
  }
}
