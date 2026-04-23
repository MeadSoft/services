// auth.controller.ts
import { FirebaseAuthService } from '@meadsoft/google';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { CookieOptions, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import {
    AUTH_COOKIE_NAME,
    DEFAULT_ROLE,
    LocalLoginRequestSchema,
    LocalRegisterRequestSchema,
    type ILocalLoginRequest,
    type ILocalRegisterRequest,
    type User,
} from '@meadsoft/auth-contracts';
import { AuthConfig } from './auth.config';
import { UserAccountService } from './services/user-account.service';
import { EMPTY_LENGTH } from '@meadsoft/common-server';

const SECONDS_TO_MILLISECONDS = 1000;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const DEFAULT_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const MINIMUM_COOKIE_MAX_AGE_MILLISECONDS = 1;

@Controller('auth')
export class AuthController {
    constructor(
        private readonly firebaseAuth: FirebaseAuthService,
        private readonly jwtService: JwtService,
        private readonly authConfig: AuthConfig,
        private readonly userAccountService: UserAccountService,
    ) {}

    @Post('firebase-login')
    async firebaseLogin(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<User> {
        const authHeader = req.headers['authorization'];
        if (authHeader == null) throw new UnauthorizedException();

        const idToken = this.extractIdToken(authHeader);
        let decoded: DecodedIdToken;
        try {
            decoded = await this.firebaseAuth.verifyIdToken(idToken);
        } catch {
            throw new UnauthorizedException();
        }

        const user =
            await this.userAccountService.findOrCreateFromFirebase(decoded);

        const response: User = {
            id: user.id,
            email: user.email ?? undefined,
            roles:
                user.iamRoles.length > EMPTY_LENGTH
                    ? user.iamRoles
                    : [DEFAULT_ROLE],
        };

        const jwt = this.jwtService.sign(response, {
            secret: this.authConfig.env.JWT_SECRET,
        });

        this.setAuthCookie(res, jwt);

        return response;
    }

    @Post('register')
    async register(
        @Body() body: ILocalRegisterRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<User> {
        const parsed = LocalRegisterRequestSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.issues);
        }

        const { email, password, displayName } = parsed.data;
        const user = await this.userAccountService.registerLocal(
            email,
            password,
            displayName,
        );

        const response: User = {
            id: user.id,
            email: user.email ?? undefined,
            roles:
                user.iamRoles.length > EMPTY_LENGTH
                    ? user.iamRoles
                    : [DEFAULT_ROLE],
        };

        const jwt = this.jwtService.sign(response, {
            secret: this.authConfig.env.JWT_SECRET,
        });

        this.setAuthCookie(res, jwt);

        return response;
    }

    @Post('login')
    async login(
        @Body() body: ILocalLoginRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<User> {
        const parsed = LocalLoginRequestSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.issues);
        }

        const { email, password } = parsed.data;
        const user = await this.userAccountService.validateLocalCredentials(
            email,
            password,
        );

        const response: User = {
            id: user.id,
            email: user.email ?? undefined,
            roles:
                user.iamRoles.length > EMPTY_LENGTH
                    ? user.iamRoles
                    : [DEFAULT_ROLE],
        };

        const jwt = this.jwtService.sign(response, {
            secret: this.authConfig.env.JWT_SECRET,
        });

        this.setAuthCookie(res, jwt);

        return response;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
        res.clearCookie(AUTH_COOKIE_NAME, this.getCookieOptions());
        return Promise.resolve();
    }

    @Get('me')
    async getCurrentUser(@Req() req: Request): Promise<User> {
        const jwt = req.cookies?.[AUTH_COOKIE_NAME];
        if (!jwt) {
            throw new UnauthorizedException('Not authenticated');
        }

        let payload: User;
        try {
            payload = this.jwtService.verify(jwt);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        return Promise.resolve({
            id: payload.id,
            email: payload.email,
            roles: payload.roles,
        });
    }

    private extractIdToken(authHeader: string | string[]): string {
        const headerValue = Array.isArray(authHeader)
            ? authHeader[0]
            : authHeader;
        const trimmed = headerValue.trim();

        if (trimmed.toLowerCase().startsWith('bearer ')) {
            return trimmed.slice('bearer '.length).trim();
        }

        return trimmed;
    }

    private setAuthCookie(res: Response, jwt: string): void {
        res.cookie(AUTH_COOKIE_NAME, jwt, this.getCookieOptions());
    }

    private getCookieOptions(): CookieOptions {
        const cookieDomain = this.authConfig.env.AUTH_COOKIE_DOMAIN?.trim();
        const isProduction = process.env.NODE_ENV === 'production';
        const secure =
            this.authConfig.env.AUTH_COOKIE_SECURE != null
                ? this.authConfig.env.AUTH_COOKIE_SECURE === 'true'
                : isProduction;
        const configuredMaxAgeSeconds = Number(
            this.authConfig.env.AUTH_COOKIE_MAX_AGE_SECONDS,
        );
        const maxAgeSeconds =
            Number.isFinite(configuredMaxAgeSeconds) &&
            configuredMaxAgeSeconds > EMPTY_LENGTH
                ? configuredMaxAgeSeconds
                : DEFAULT_COOKIE_MAX_AGE_SECONDS;
        const rawMaxAgeMilliseconds = maxAgeSeconds * SECONDS_TO_MILLISECONDS;
        const maxAgeMilliseconds = Number.isFinite(rawMaxAgeMilliseconds)
            ? Math.floor(rawMaxAgeMilliseconds)
            : NaN;

        const options: CookieOptions = {
            httpOnly: true,
            secure,
            sameSite: this.authConfig.env.AUTH_COOKIE_SAME_SITE,
            path: '/',
        };

        if (
            Number.isFinite(maxAgeMilliseconds) &&
            maxAgeMilliseconds >= MINIMUM_COOKIE_MAX_AGE_MILLISECONDS
        ) {
            options.maxAge = maxAgeMilliseconds;
        }

        if (cookieDomain) {
            options.domain = cookieDomain;
        }

        return options;
    }
}
