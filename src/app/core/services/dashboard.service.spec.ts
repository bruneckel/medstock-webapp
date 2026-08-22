import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';
import { DashboardResumo } from '../models';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches the dashboard summary', () => {
    const resumoFalso: DashboardResumo = {
      geradoEm: '2026-08-22T12:00:00Z',
      estoque: { total: 100, criticos: 5, atencao: 10, normais: 85, vencendo: 3 },
      pedidosDoDia: [],
      alertasRecentes: [],
    };

    service.resumo().subscribe((resumo) => expect(resumo).toEqual(resumoFalso));

    const requisicao = httpMock.expectOne(`${environment.apiUrl}/dashboard/resumo`);
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush(resumoFalso);
  });
});
