import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { PedidoForm } from './pedido-form';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ItemService } from '../../../core/services/item.service';
import { Pedido } from '../../../core/models';

describe('PedidoForm', () => {
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
      imports: [PedidoForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    vi.spyOn(TestBed.inject(FornecedorService), 'listar').mockReturnValue(of([]));
    vi.spyOn(TestBed.inject(ItemService), 'listar').mockReturnValue(
      of({ conteudo: [], pagina: 0, tamanho: 100, totalElementos: 0, totalPaginas: 0 }),
    );
  });

  it('adds and removes item rows', () => {
    const fixture = TestBed.createComponent(PedidoForm);
    const componente = fixture.componentInstance;
    expect(componente.itensPedido.length).toBe(1);

    componente.adicionarLinha();
    expect(componente.itensPedido.length).toBe(2);

    componente.removerLinha(0);
    expect(componente.itensPedido.length).toBe(1);
  });

  it('creates the pedido with only the filled-in item rows', () => {
    const pedidoService = TestBed.inject(PedidoService);
    const criarSpy = vi.spyOn(pedidoService, 'criar').mockReturnValue(of(pedidoFalso));
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(PedidoForm);
    const componente = fixture.componentInstance;
    componente.fornecedorId = 'f1';
    componente.etaPrevista = '2026-09-01T10:00';
    componente.itensPedido = [{ itemId: 'i1', quantidade: 10, valorUnitario: 100 }];
    componente.salvar({ invalid: false });

    expect(criarSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        fornecedorId: 'f1',
        itens: [{ itemId: 'i1', quantidade: 10, valorUnitario: 100 }],
      }),
    );
    expect(navigateSpy).toHaveBeenCalledWith('/admin/pedidos');
  });

  it('blocks submission when there are no valid item rows', () => {
    const pedidoService = TestBed.inject(PedidoService);
    const criarSpy = vi.spyOn(pedidoService, 'criar');

    const fixture = TestBed.createComponent(PedidoForm);
    const componente = fixture.componentInstance;
    componente.fornecedorId = 'f1';
    componente.etaPrevista = '2026-09-01T10:00';
    componente.itensPedido = [{ itemId: '', quantidade: null, valorUnitario: null }];
    componente.salvar({ invalid: false });

    expect(criarSpy).not.toHaveBeenCalled();
    expect(componente.erroGeral()).toBe('Adicione ao menos um item ao pedido.');
  });
});
