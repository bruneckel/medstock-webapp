import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Registro } from './registro';
import { AuthService } from '../../../core/auth/auth.service';
import { Usuario } from '../../../core/models';

describe('Registro', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('navigates to /login after a successful registration', () => {
    vi.spyOn(authService, 'registrar').mockReturnValue(of({} as Usuario));
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(Registro);
    const componente = fixture.componentInstance;
    componente.nome = 'Ana Farmacêutica';
    componente.email = 'ana@fiap.com.br';
    componente.senha = 'senha1234';
    componente.registrar({ invalid: false } as never);

    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('maps field errors on a 422 domain email rejection', () => {
    const erro = new HttpErrorResponse({
      status: 422,
      error: { mensagem: 'E-mail fora do domínio institucional', campos: [{ campo: 'email', erro: 'domínio não permitido' }] },
    });
    vi.spyOn(authService, 'registrar').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(Registro);
    const componente = fixture.componentInstance;
    componente.nome = 'Ana';
    componente.email = 'ana@gmail.com';
    componente.senha = 'senha1234';
    componente.registrar({ invalid: false } as never);

    expect(componente.errosDeCampo()['email']).toBe('domínio não permitido');
  });
});
