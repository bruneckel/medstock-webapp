import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ItemForm } from './item-form';
import { ItemService } from '../../../core/services/item.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { Item } from '../../../core/models';

describe('ItemForm', () => {
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

  function configurar(idNaRota: string | null) {
    TestBed.configureTestingModule({
      imports: [ItemForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(idNaRota ? { id: idNaRota } : {}) } },
        },
      ],
    });
    const fornecedorService = TestBed.inject(FornecedorService);
    vi.spyOn(fornecedorService, 'listar').mockReturnValue(of([]));
  }

  it('creates a new item and navigates to the list', () => {
    configurar(null);
    const itemService = TestBed.inject(ItemService);
    const criarSpy = vi.spyOn(itemService, 'criar').mockReturnValue(of(itemFalso));
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(ItemForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Soro fisiológico';
    componente.categoria = 'Soluções';
    componente.unidadeMedida = 'un';
    componente.quantidadeAtual = 50;
    componente.quantidadeMinima = 20;
    componente.dataValidade = '2027-01-01';
    componente.salvar({ invalid: false });

    expect(criarSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/admin/itens');
  });

  it('loads the item into the form fields when editing', () => {
    configurar('1');
    const itemService = TestBed.inject(ItemService);
    vi.spyOn(itemService, 'buscarPorId').mockReturnValue(of(itemFalso));

    const fixture = TestBed.createComponent(ItemForm);

    expect(fixture.componentInstance.nome).toBe('Soro fisiológico');
    expect(fixture.componentInstance.idEmEdicao()).toBe('1');
  });

  it('maps a validation error onto the corresponding field', () => {
    configurar(null);
    const itemService = TestBed.inject(ItemService);
    const erro = new HttpErrorResponse({
      status: 400,
      error: { mensagem: 'Falha de validação', campos: [{ campo: 'dataValidade', erro: 'deve ser uma data futura' }] },
    });
    vi.spyOn(itemService, 'criar').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(ItemForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Item';
    componente.categoria = 'Cat';
    componente.unidadeMedida = 'un';
    componente.quantidadeAtual = 10;
    componente.quantidadeMinima = 5;
    componente.dataValidade = '2020-01-01';
    componente.salvar({ invalid: false });

    expect(componente.errosDeCampo()['dataValidade']).toBe('deve ser uma data futura');
  });
});
