import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap, catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  if (req.url.includes('/auth/token')) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  } else {
    return authService.refreshToken().pipe(
      switchMap(response => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.token}`
          }
        });
        return next(authReq);
      }),
      catchError(error => {
        return throwError(() => new Error('No se pudo autenticar'));
      })
    );
  }
};
