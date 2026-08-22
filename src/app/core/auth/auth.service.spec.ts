import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { TokenResponse } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const respostaToken: TokenResponse = {
    token: 'jwt-fake',
    tipo: 'Bearer',
    expiraEm: '2026-08-23T00:00:00Z',
    usuario: {
      id: '1',
      nome: 'Ana Farmacêutica',
      email: 'ana@fiap.com.br',
      matricula: 'FA-2026-00001',
      departamento: 'Farmácia',
      cargo: 'Farmacêutica',
      registroProfissional: 'CRF-1234',
      hospital: 'Hospital FIAP',
      perfil: 'FARMACEUTICO',
      ativo: true,
      criadoEm: '2026-01-01T00:00:00Z',
    },
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('starts unauthenticated with no stored session', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.usuario()).toBeNull();
  });

  it('persists the session and exposes signals after login', () => {
    service.login({ email: 'ana@fiap.com.br', senha: 'senha1234' }).subscribe();

    const requisicao = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(requisicao.request.method).toBe('POST');
    requisicao.flush(respostaToken);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('jwt-fake');
    expect(service.perfil()).toBe('FARMACEUTICO');
    expect(localStorage.getItem('medstock.sessao')).toContain('jwt-fake');
  });

  it('clears the session on logout', () => {
    service.login({ email: 'ana@fiap.com.br', senha: 'senha1234' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(respostaToken);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('medstock.sessao')).toBeNull();
  });
});
