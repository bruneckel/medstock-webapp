import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PedidoService } from './pedido.service';
import { environment } from '../../../environments/environment';
import { Pedido } from '../models';

describe('PedidoService', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;

  const pedidoFalso: Pedido = {
    id: '1',
    codigo: '#0001',
    fornecedorId: 'f1',
    status: 'PENDENTE',
    dataPedido: '2026-08-20T00:00:00Z',
    etaPrevista: '2026-08-25T00:00:00Z',
    dataEntrega: null,
    reentregaPrevistaEm: null,
    slaHoras: 48,
    valorTotal: 1000,
    valorReembolso: null,
    motivoAtraso: null,
    motivoOcorrencia: null,
    itens: [{ itemId: 'i1', quantidade: 10, valorUnitario: 100 }],
    slaExcedido: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists pedidos with only the provided filters as query params', () => {
    service.listar({ status: 'PENDENTE' }).subscribe((lista) => expect(lista).toEqual([pedidoFalso]));

    const requisicao = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/pedidos` && r.params.get('status') === 'PENDENTE',
    );
    expect(requisicao.request.params.has('fornecedorId')).toBe(false);
    requisicao.flush([pedidoFalso]);
  });

  it('confirms a pedido via POST', () => {
    service.confirmar('1').subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/pedidos/1/confirmar`);
    expect(requisicao.request.method).toBe('POST');
    requisicao.flush(pedidoFalso);
  });

  it('updates status via PATCH', () => {
    service.atualizarStatus('1', { status: 'EM_ROTA' }).subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/pedidos/1/status`);
    expect(requisicao.request.method).toBe('PATCH');
    requisicao.flush(pedidoFalso);
  });
});
