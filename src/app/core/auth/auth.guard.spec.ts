import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('allows navigation when authenticated', () => {
    Object.defineProperty(authService, 'isAuthenticated', { value: () => true });

    const resultado = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/home' } as never),
    );

    expect(resultado).toBe(true);
  });

  it('redirects to /login with a returnUrl when not authenticated', () => {
    Object.defineProperty(authService, 'isAuthenticated', { value: () => false });

    const resultado = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/admin/itens' } as never),
    ) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/login?returnUrl=%2Fadmin%2Fitens');
  });
});
