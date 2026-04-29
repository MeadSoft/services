import type { Request, Response } from 'express';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    IAM_COOKIE_NAME,
    LocalLoginRequestSchema,
    LocalRegisterRequestSchema,
    type ILocalLoginRequest,
    type ILocalRegisterRequest,
    type IPrinciple,
} from '@meadsoft/iam-contracts';
import { SYSTEM_UUID } from '@meadsoft/common';
import { SaltingService } from '@meadsoft/common-server';
import { IamConfig } from '../iam.config';
import { PrincipleService } from '../services/principle.service';

@Controller('principle')
export class PrincipleController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authConfig: IamConfig,
        private readonly principleService: PrincipleService,
        private readonly saltingService: SaltingService,
    ) {}

    @Post('register/local')
    async register(
        @Body() body: ILocalRegisterRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<IPrinciple> {
        const parsed = LocalRegisterRequestSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.issues);
        }

        const { email, password, displayName } = parsed.data;
        const principle = await this.principleService.registerWithLocalLogin(
            SYSTEM_UUID,
            email,
            password,
            displayName ?? null,
        );

        this.setIamCookie(res, principle);
        return principle;
    }

    @Post('login/local')
    async login(
        @Body() body: ILocalLoginRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<IPrinciple> {
        const parsed = LocalLoginRequestSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.issues);
        }

        const { email, password } = parsed.data;
        const principle = await this.principleService.findByEmail(email);
        if (!principle) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const localLoginMethod = principle.loginMethods.find(
            (m) => m.provider === 'local',
        );
        if (localLoginMethod === undefined) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (localLoginMethod.passwordHash === null) {
            // passwordHash should never be null for a local login method, but we check just in case
            // if it is null, a 500 is returned instead of a 401 since this indicates a server error rather than just invalid credentials
            throw new InternalServerErrorException();
        }
        const isPasswordValid = await this.saltingService.verify(
            password,
            localLoginMethod.passwordHash,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        this.setIamCookie(res, principle);
        return principle;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
        res.clearCookie(IAM_COOKIE_NAME, this.authConfig.file.cookie);
        return Promise.resolve();
    }

    @Get('me')
    async getCurrentPrinciple(@Req() req: Request): Promise<IPrinciple> {
        const jwt = req.cookies?.[IAM_COOKIE_NAME];
        if (!jwt) {
            throw new UnauthorizedException('Not authenticated');
        }

        let payload: IPrinciple;
        try {
            payload = this.jwtService.verify(jwt);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        return Promise.resolve(payload);
    }

    private setIamCookie(res: Response, principle: IPrinciple): void {
        const jwt = this.jwtService.sign(principle, {
            secret: this.authConfig.env.JWT_SECRET,
        });
        res.cookie(IAM_COOKIE_NAME, jwt, this.authConfig.file.cookie);
    }
}
