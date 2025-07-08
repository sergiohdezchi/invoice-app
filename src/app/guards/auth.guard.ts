import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.token$.pipe(
    take(1),
    map(token => {
      const isAuthenticated = !!token;
      if (isAuthenticated) {
        return true;
      }
      
      // Si no está autenticado, redirige a la página de login
      return router.createUrlTree(['/login']);
    })
  );
};
