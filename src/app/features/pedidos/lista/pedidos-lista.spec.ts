import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PedidosLista } from './pedidos-lista';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { Pedido, Fornecedor } from '../../../core/models';

describe('PedidosLista', () => {
  const fornecedorFalso: Fornecedor = {
    id: 'f1',
    nome: 'Farma Distribuidora',
    cnpj: '12345678000199',
    email: 'contato@farma.com.br',
    telefone: null,
    slaHoras: 48,
    scoreConfiabilidade: 90,
    historicoAtrasos: 0,
    ativo: true,
  };
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
      imports: [PedidosLista],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fornecedorService = TestBed.inject(FornecedorService);
    vi.spyOn(fornecedorService, 'listar').mockReturnValue(of([fornecedorFalso]));
  });

  it('loads pedidos on init and resolves the fornecedor name', () => {
    const pedidoService = TestBed.inject(PedidoService);
    vi.spyOn(pedidoService, 'listar').mockReturnValue(of([pedidoFalso]));

    const fixture = TestBed.createComponent(PedidosLista);
    fixture.detectChanges();

    expect(fixture.componentInstance.pedidos()).toEqual([pedidoFalso]);
    expect(fixture.componentInstance.nomeFornecedor('f1')).toBe('Farma Distribuidora');
  });

  it('calls listarAtrasados when the somente atrasados toggle is on', () => {
    const pedidoService = TestBed.inject(PedidoService);
    vi.spyOn(pedidoService, 'listar').mockReturnValue(of([]));
    const atrasadosSpy = vi.spyOn(pedidoService, 'listarAtrasados').mockReturnValue(of([pedidoFalso]));

    const fixture = TestBed.createComponent(PedidosLista);
    fixture.detectChanges();
    fixture.componentInstance.somenteAtrasados = true;
    fixture.componentInstance.aplicarFiltros();

    expect(atrasadosSpy).toHaveBeenCalled();
  });
});
