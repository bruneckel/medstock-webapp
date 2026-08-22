import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { environment } from '../../../environments/environment';
import { Item, PaginaResponse } from '../models';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  const itemFalso: Item = {
    id: '1',
    nome: 'Soro fisiológico',
    descricao: '',
    categoria: 'Soluções',
    unidadeMedida: 'un',
    quantidadeAtual: 50,
    quantidadeMinima: 20,
    quantidadeMaxima: 200,
    quantidadeRecomendadaIa: null,
    localArmazenamento: 'Almoxarifado A',
    fornecedorId: 'forn-1',
    tipo: 'PRIMORDIAL',
    lote: 'L1',
    dataValidade: '2027-01-01',
    status: 'NORMAL',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists items with query params only for provided filters', () => {
    const pagina: PaginaResponse<Item> = {
      conteudo: [itemFalso],
      pagina: 0,
      tamanho: 20,
      totalElementos: 1,
      totalPaginas: 1,
    };

    service.listar({ status: 'CRITICO', page: 0, size: 20 }).subscribe((resultado) => {
      expect(resultado).toEqual(pagina);
    });

    const requisicao = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/itens` && r.params.get('status') === 'CRITICO',
    );
    expect(requisicao.request.params.has('categoria')).toBe(false);
    requisicao.flush(pagina);
  });

  it('adjusts quantity via PATCH', () => {
    service.ajustarQuantidade('1', { tipo: 'SAIDA', quantidade: 5 }).subscribe();

    const requisicao = httpMock.expectOne(`${environment.apiUrl}/itens/1/quantidade`);
    expect(requisicao.request.method).toBe('PATCH');
    requisicao.flush(itemFalso);
  });

  it('removes an item via DELETE', () => {
    service.remover('1').subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/itens/1`);
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush(null);
  });
});
