import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  it('does not attach an Authorization header when there is no session', () => {
    http.get('/api/v1/itens').subscribe();
    const requisicao = httpMock.expectOne('/api/v1/itens');
    expect(requisicao.request.headers.has('Authorization')).toBe(false);
    requisicao.flush([]);
  });

  it('attaches the bearer token when a session exists', () => {
    (authService as unknown as { _token: { set(v: string): void } });
    Object.defineProperty(authService, 'token', { value: () => 'jwt-fake' });

    http.get('/api/v1/itens').subscribe();
    const requisicao = httpMock.expectOne('/api/v1/itens');
    expect(requisicao.request.headers.get('Authorization')).toBe('Bearer jwt-fake');
    requisicao.flush([]);
  });

  it('logs out and redirects to /login on a 401', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    const logoutSpy = vi.spyOn(authService, 'logout');

    http.get('/api/v1/itens').subscribe({ error: () => {} });
    const requisicao = httpMock.expectOne('/api/v1/itens');
    requisicao.flush({ mensagem: 'não autenticado' }, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});
