import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ItensLista } from './itens-lista';
import { ItemService } from '../../../core/services/item.service';
import { Item, PaginaResponse } from '../../../core/models';

describe('ItensLista', () => {
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
    fornecedorId: 'f1',
    tipo: 'PRIMORDIAL',
    lote: 'L1',
    dataValidade: '2027-01-01',
    status: 'NORMAL',
    criadoEm: '2026-01-01T00:00:00Z',
    atualizadoEm: '2026-01-01T00:00:00Z',
  };
  const paginaFalsa: PaginaResponse<Item> = {
    conteudo: [itemFalso],
    pagina: 0,
    tamanho: 20,
    totalElementos: 1,
    totalPaginas: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItensLista],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    });
  });

  it('loads the first page of items on init', () => {
    const itemService = TestBed.inject(ItemService);
    vi.spyOn(itemService, 'listar').mockReturnValue(of(paginaFalsa));

    const fixture = TestBed.createComponent(ItensLista);
    fixture.detectChanges();

    expect(fixture.componentInstance.itens()).toEqual([itemFalso]);
    expect(fixture.componentInstance.totalElementos()).toBe(1);
    expect(fixture.componentInstance.carregando()).toBe(false);
  });

  it('removes an item after the confirm dialog resolves true', () => {
    const itemService = TestBed.inject(ItemService);
    vi.spyOn(itemService, 'listar').mockReturnValue(of(paginaFalsa));
    const removerSpy = vi.spyOn(itemService, 'remover').mockReturnValue(of(undefined));

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as never);

    const fixture = TestBed.createComponent(ItensLista);
    fixture.detectChanges();
    fixture.componentInstance.excluir(itemFalso);

    expect(removerSpy).toHaveBeenCalledWith('1');
  });

  it('does not remove when the confirm dialog resolves false', () => {
    const itemService = TestBed.inject(ItemService);
    vi.spyOn(itemService, 'listar').mockReturnValue(of(paginaFalsa));
    const removerSpy = vi.spyOn(itemService, 'remover');

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(false) } as never);

    const fixture = TestBed.createComponent(ItensLista);
    fixture.detectChanges();
    fixture.componentInstance.excluir(itemFalso);

    expect(removerSpy).not.toHaveBeenCalled();
  });
});
