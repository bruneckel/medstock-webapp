import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrevisaoService } from './previsao.service';
import { environment } from '../../../environments/environment';
import { Previsao } from '../models';

describe('PrevisaoService', () => {
  let service: PrevisaoService;
  let httpMock: HttpTestingController;

  const previsaoFalsa: Previsao = {
    id: 'p1',
    itemId: 'i1',
    geradoEm: '2026-08-22T00:00:00Z',
    historico: [{ periodo: '2026-06', valor: 100 }],
    previsao: [{ periodo: '2026-09', valor: 120 }],
    recomendacao: 'Aumentar pedido em 20%',
    fatoresConsiderados: ['Sazonalidade'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PrevisaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches the latest previsão for an item', () => {
    service.buscarPorItem('i1').subscribe((previsao) => expect(previsao).toEqual(previsaoFalsa));
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/previsoes/i1`);
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush(previsaoFalsa);
  });

  it('generates a new previsão via POST', () => {
    service.gerar('i1').subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/previsoes/i1/gerar`);
    expect(requisicao.request.method).toBe('POST');
    requisicao.flush(previsaoFalsa);
  });
});
