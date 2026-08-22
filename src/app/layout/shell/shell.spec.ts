import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Shell } from './shell';
import { AuthService } from '../../core/auth/auth.service';

describe('Shell', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('hides the Usuários nav item for a non-ADMIN profile', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'FARMACEUTICO' });
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    const itemUsuarios = componente.itensDeNavegacao.find((i) => i.rota === '/admin/usuarios')!;
    expect(componente.podeVer(itemUsuarios)).toBe(false);
  });

  it('shows the Usuários nav item for ADMIN', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'ADMIN' });
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    const itemUsuarios = componente.itensDeNavegacao.find((i) => i.rota === '/admin/usuarios')!;
    expect(componente.podeVer(itemUsuarios)).toBe(true);
  });

  it('logs out and redirects to /login on sair()', () => {
    const logoutSpy = vi.spyOn(authService, 'logout');
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(Shell);

    fixture.componentInstance.sair();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});
