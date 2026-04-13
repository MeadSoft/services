import { AUTH_COOKIE_NAME } from '@meadsoft/auth-contracts';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export function AuthGuard() {
    return NestAuthGuard(AUTH_COOKIE_NAME);
}
