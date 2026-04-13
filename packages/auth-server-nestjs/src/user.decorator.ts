import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { UserSchema, type User } from '@meadsoft/auth-contracts';

export const CurrentUser = createParamDecorator(
    (ctx: ExecutionContext): User | undefined => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return undefined;
        }
        const result = UserSchema.safeParse(user);
        if (!result.success) {
            throw new UnauthorizedException('Invalid user data in request');
        }
        return result.data;
    },
);
