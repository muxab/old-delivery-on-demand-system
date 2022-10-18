import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
        usernameField:'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'nestJsTutorial',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      name:payload.name,
      role:payload.role,
      status: payload.status,
    };
  }
}
