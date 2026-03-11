import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type AccessPayload = {
  sub: string;
  username: string;
  type: 'ACCESS';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret',
    });
  }

  validate(payload: AccessPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
