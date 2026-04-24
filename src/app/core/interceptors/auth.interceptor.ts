import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AuthService } from "../services/auth.service";
import { API_BASE_URL } from "../tokens/api-base-url.token";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const baseUrl = inject(API_BASE_URL);
    const authService = inject(AuthService);

    if (!req.url.startsWith(baseUrl)) {
        return next(req);
    }

    const email = authService.currentUser?.email;
    if (!email) {
        return next(req);
    }

    const cloned = req.clone({
        setHeaders: { "x-user-email": email }
    });
    return next(cloned);
};
