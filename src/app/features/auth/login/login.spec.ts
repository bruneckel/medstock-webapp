import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from './login';
import { AuthService } from '../../../core/auth/auth.service';
import { TokenResponse } from '../../../core/models';

describe('Login', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('navigates to /home after a successful login', () => {
    vi.spyOn(authService, 'login').mockReturnValue(of({} as TokenResponse));
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(Login);
    const componente = fixture.componentInstance;
    componente.email = 'ana@fiap.com.br';
    componente.senha = 'senha1234';
    componente.entrar({ invalid: false } as never);

    expect(navigateSpy).toHaveBeenCalledWith('/home');
  });

  it('shows the API message on login failure', () => {
    const erro = new HttpErrorResponse({ status: 401, error: { mensagem: 'Credenciais inválidas' } });
    vi.spyOn(authService, 'login').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(Login);
    const componente = fixture.componentInstance;
    componente.email = 'ana@fiap.com.br';
    componente.senha = 'errada';
    componente.entrar({ invalid: false } as never);

    expect(componente.erroGeral()).toBe('Credenciais inválidas');
    expect(componente.carregando()).toBe(false);
  });
});
