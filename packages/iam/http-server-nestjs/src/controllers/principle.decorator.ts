import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { PrincipleSchema, type IPrinciple } from '@meadsoft/iam-contracts';

export const CurrentPrinciple = createParamDecorator(
    (ctx: ExecutionContext): IPrinciple | undefined => {
        const request = ctx.switchToHttp().getRequest();
        const principle = request.user;
        if (!principle) {
            return undefined;
        }
        const result = PrincipleSchema.safeParse(principle);
        if (!result.success) {
            throw new UnauthorizedException(
                'Invalid principle data in request',
            );
        }
        return result.data;
    },
);
