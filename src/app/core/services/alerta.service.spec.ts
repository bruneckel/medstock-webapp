import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlertaService } from './alerta.service';
import { environment } from '../../../environments/environment';
import { Alerta } from '../models';

describe('AlertaService', () => {
  let service: AlertaService;
  let httpMock: HttpTestingController;

  const alertaFalso: Alerta = {
    id: '1',
    tipo: 'ESTOQUE_CRITICO',
    severidade: 'CRITICO',
    titulo: 'Estoque crítico: Soro fisiológico',
    mensagem: 'Quantidade abaixo de 30% do mínimo',
    itemId: 'i1',
    pedidoId: null,
    status: 'ATIVO',
    acaoTomada: null,
    criadoEm: '2026-08-22T00:00:00Z',
    resolvidoEm: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AlertaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists alertas with only the provided filters', () => {
    service.listar({ status: 'ATIVO' }).subscribe((lista) => expect(lista).toEqual([alertaFalso]));
    const requisicao = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/alertas` && r.params.get('status') === 'ATIVO',
    );
    expect(requisicao.request.params.has('tipo')).toBe(false);
    requisicao.flush([alertaFalso]);
  });

  it('runs the automatic scan via POST /gerar', () => {
    service.gerar().subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/alertas/gerar`);
    expect(requisicao.request.method).toBe('POST');
    requisicao.flush([]);
  });

  it('resolves an alerta via PATCH', () => {
    service.resolver('1').subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/alertas/1/resolver`);
    expect(requisicao.request.method).toBe('PATCH');
    requisicao.flush(alertaFalso);
  });
});
