import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap, catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Skip authentication for login and register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
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
        if (response && response.token) {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.token}`
            }
          });
          return next(authReq);
        } else {
          // If we can't get a token, there's no authentication
          authService.logoutLocally(); // Clean up local storage
          return throwError(() => new Error('No se pudo autenticar'));
        }
      }),
      catchError(error => {
        return throwError(() => new Error('No se pudo autenticar'));
      })
    );
  }
};
