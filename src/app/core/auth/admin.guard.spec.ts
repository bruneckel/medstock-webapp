import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
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

  it('allows the match when the profile is ADMIN', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'ADMIN' });

    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as never, [], {} as never));

    expect(resultado).toBe(true);
  });

  it('redirects to /home for any other profile', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'FARMACEUTICO' });

    const resultado = TestBed.runInInjectionContext(() => adminGuard({} as never, [], {} as never)) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/home');
  });
});
