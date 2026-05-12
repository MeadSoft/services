import type { Response } from 'express';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    IAM_COOKIE_NAME,
    LocalLoginRequestSchema,
    LocalRegisterRequestSchema,
    type IPrincipleWithRelations,
    type ILocalLoginRequest,
    type ILocalRegisterRequest,
    SERVICE_NAME,
    PRINCIPLES_RESOURCE_NAME,
} from '@meadsoft/iam-contracts';
import { IFilter, SYSTEM_UUID } from '@meadsoft/common';
import { SaltingService } from '@meadsoft/common-server';
import { IamConfig } from '../iam.config';
import { PrincipleService } from '../services/principle.service';
import { CurrentPrinciple } from './principle.decorator';
import { PrincipleRepository } from '../database/repositories';

@Controller('principle')
export class PrincipleController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authConfig: IamConfig,
        private readonly principleService: PrincipleService,
        private readonly principleRepository: PrincipleRepository,
        private readonly saltingService: SaltingService,
    ) {}

    @Post('register/local')
    async register(
        @Body() body: ILocalRegisterRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<IPrincipleWithRelations> {
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
    ): Promise<IPrincipleWithRelations> {
        const parsed = LocalLoginRequestSchema.safeParse(body);
        if (!parsed.success) {
            throw new BadRequestException(parsed.error.issues);
        }

        const { email, password } = parsed.data;
        const emailFilter: IFilter = {
            service: SERVICE_NAME,
            resource: PRINCIPLES_RESOURCE_NAME,
            field: 'email',
            operator: 'eq',
            value: email,
        };
        const principleResult =
            await this.principleRepository.findFirstWithRelations([
                emailFilter,
            ]);
        if (principleResult.err) {
            throw new InternalServerErrorException(principleResult.val.message);
        }
        const principle = principleResult.val;
        if (principle === null) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const localLoginMethod = principle.loginMethods?.find(
            (method) =>
                method.provider === 'local' && method.providerEmail === email,
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
    async getCurrentPrinciple(
        @CurrentPrinciple() principle: IPrincipleWithRelations,
    ): Promise<IPrincipleWithRelations> {
        return Promise.resolve(principle);
    }

    private setIamCookie(
        res: Response,
        principle: IPrincipleWithRelations,
    ): void {
        const jwt = this.jwtService.sign(principle, {
            secret: this.authConfig.env.JWT_SECRET,
        });
        res.cookie(IAM_COOKIE_NAME, jwt, this.authConfig.file.cookie);
    }
}
