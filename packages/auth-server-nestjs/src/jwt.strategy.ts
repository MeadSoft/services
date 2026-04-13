import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME, User, UserSchema } from '@meadsoft/auth-contracts';
import { AuthConfig } from './auth.config';
import { Request } from 'express';

export interface JwtPayload {
    id: string;
    email?: string;
    roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(authConfig: AuthConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const cookies: Record<string, string> | undefined = request.cookies;
                    if (!cookies) {
                        return null;
                    }
                    const token: string | undefined = cookies[AUTH_COOKIE_NAME];
                    return token ?? null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: authConfig.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        if (!payload.id) {
            throw new UnauthorizedException();
        }
        const result = UserSchema.safeParse(payload);
        if (!result.success) {
            throw new UnauthorizedException('Invalid token payload');
        }
        return Promise.resolve(result.data);
    }
}
