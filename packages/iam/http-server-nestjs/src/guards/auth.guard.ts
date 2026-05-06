import {
    IAM_COOKIE_NAME,
    IPrincipleWithRelations,
    PrincipleWithRelationsSchema,
} from '@meadsoft/iam-contracts';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IamConfig } from '../iam.config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly iamConfig: IamConfig,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookies(request);
        if (token === undefined) {
            throw new UnauthorizedException();
        }
        const decodedPrinciple = await this.decodePrincipleFromToken(token);
        if (decodedPrinciple === null) {
            throw new UnauthorizedException();
        }
        request.user = decodedPrinciple;
        return true;
    }

    private extractTokenFromCookies(request: Request): string | undefined {
        const cookies = request.cookies;
        if (cookies === undefined || typeof cookies !== 'object') {
            return undefined;
        }
        const token = cookies[IAM_COOKIE_NAME];
        return typeof token === 'string' ? token : undefined;
    }

    private async decodePrincipleFromToken(
        token: string,
    ): Promise<IPrincipleWithRelations | null> {
        try {
            const rawPrinciple = await this.jwtService.verifyAsync(token, {
                secret: this.iamConfig.env.JWT_SECRET,
            });
            const principle =
                PrincipleWithRelationsSchema.safeParse(rawPrinciple);
            if (!principle.success) {
                return null;
            }
            return principle.data;
        } catch {
            return null;
        }
    }
}
