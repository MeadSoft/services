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
import type { Request, Response } from 'express';
import {
    IAM_COOKIE_NAME,
    LocalLoginRequestSchema,
    LocalRegisterRequestSchema,
    type ILocalLoginRequest,
    type ILocalRegisterRequest,
    type IPrinciple,
} from '@meadsoft/iam-contracts';
import { IamConfig } from '../iam.config';
import { PrincipleService } from '../services/principle.service';

@Controller('principle')
export class PrincipleController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authConfig: IamConfig,
        private readonly principleService: PrincipleService,
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
        const principle = await this.principleService.registerLocal(
            email,
            password,
            displayName,
        );

        this.setAuthCookie(res, principle);
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
        const principle = await this.principleService.validateLocalCredentials(
            email,
            password,
        );

        this.setAuthCookie(res, principle);
        return principle;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
        res.clearCookie(IAM_COOKIE_NAME, this.authConfig.file.cookie);
        return Promise.resolve();
    }

    @Get('me')
    async getCurrentPrinciple(@Req() req: Request): Promise<IPrinciple> {
        const jwt = req.cookies?.[AUTH_COOKIE_NAME];
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

    private setAuthCookie(res: Response, principle: IPrinciple): void {
        const jwt = this.jwtService.sign(principle, {
            secret: this.authConfig.env.JWT_SECRET,
        });
        res.cookie(IAM_COOKIE_NAME, jwt, this.authConfig.file.cookie);
    }
}
