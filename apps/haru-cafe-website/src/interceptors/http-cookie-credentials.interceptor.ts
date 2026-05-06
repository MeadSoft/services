import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '@haru-cafe/configs/config.schema';

@Injectable()
export class HttpCookieCredentialsInterceptor implements HttpInterceptor {
    constructor(private readonly config: Config) {}

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        if (req.url.startsWith(this.config.apiBaseUrl)) {
            const authReq = req.clone({
                withCredentials: true,
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}
