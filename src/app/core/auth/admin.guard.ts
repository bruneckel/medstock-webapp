import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanMatchFn = (_route, _segments, _currentSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.perfil() === 'ADMIN') {
    return true;
  }
  return router.createUrlTree(['/home']);
};
