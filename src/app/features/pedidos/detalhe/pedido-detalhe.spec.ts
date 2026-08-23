import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PedidoDetalhe } from './pedido-detalhe';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ItemService } from '../../../core/services/item.service';
import { Pedido } from '../../../core/models';

describe('PedidoDetalhe', () => {
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
      imports: [PedidoDetalhe],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    });
    vi.spyOn(TestBed.inject(FornecedorService), 'listar').mockReturnValue(of([]));
    vi.spyOn(TestBed.inject(ItemService), 'listar').mockReturnValue(
      of({ conteudo: [], pagina: 0, tamanho: 100, totalElementos: 0, totalPaginas: 0 }),
    );
  });

  it('loads the pedido on init', () => {
    vi.spyOn(TestBed.inject(PedidoService), 'buscarPorId').mockReturnValue(of(pedidoFalso));

    const fixture = TestBed.createComponent(PedidoDetalhe);
    fixture.detectChanges();

    expect(fixture.componentInstance.pedido()).toEqual(pedidoFalso);
  });

  it('replaces the pedido signal with the response from confirmar()', () => {
    vi.spyOn(TestBed.inject(PedidoService), 'buscarPorId').mockReturnValue(of(pedidoFalso));
    const pedidoEntregue: Pedido = { ...pedidoFalso, status: 'ENTREGUE' };
    const confirmarSpy = vi
      .spyOn(TestBed.inject(PedidoService), 'confirmar')
      .mockReturnValue(of(pedidoEntregue));

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as never);

    const fixture = TestBed.createComponent(PedidoDetalhe);
    fixture.detectChanges();
    fixture.componentInstance.confirmar();

    expect(confirmarSpy).toHaveBeenCalledWith('1');
    expect(fixture.componentInstance.pedido()?.status).toBe('ENTREGUE');
  });
});
