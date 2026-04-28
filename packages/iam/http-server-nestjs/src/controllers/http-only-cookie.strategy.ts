import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
    IAM_COOKIE_NAME,
    IPrinciple,
    PrincipleSchema,
} from '@meadsoft/iam-contracts';
import { IamConfig } from '../iam.config';
import { Request } from 'express';

export interface JwtPayload {
    id: string;
    email?: string;
    roles: string[];
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy) {
    constructor(authConfig: IamConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const cookies: Record<string, string> | undefined =
                        request.cookies;
                    if (!cookies) {
                        return null;
                    }
                    const token: string | undefined = cookies[IAM_COOKIE_NAME];
                    return token ?? null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: authConfig.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<IPrinciple> {
        if (!payload.id) {
            throw new UnauthorizedException();
        }
        const result = PrincipleSchema.safeParse(payload);
        if (!result.success) {
            throw new UnauthorizedException('Invalid token payload');
        }
        return Promise.resolve(result.data);
    }
}
