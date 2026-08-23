import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { AjusteQuantidadeDialog } from './ajuste-quantidade-dialog';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models';

describe('AjusteQuantidadeDialog', () => {
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
  let dialogRef: { close: (resultado?: Item) => void };

  beforeEach(() => {
    dialogRef = { close: vi.fn() };
    TestBed.configureTestingModule({
      imports: [AjusteQuantidadeDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { item: itemFalso } },
      ],
    });
  });

  it('closes the dialog with the updated item on success', () => {
    const itemService = TestBed.inject(ItemService);
    const itemAtualizado = { ...itemFalso, quantidadeAtual: 45 };
    vi.spyOn(itemService, 'ajustarQuantidade').mockReturnValue(of(itemAtualizado));

    const fixture = TestBed.createComponent(AjusteQuantidadeDialog);
    const componente = fixture.componentInstance;
    componente.tipo = 'SAIDA';
    componente.quantidade = 5;
    componente.confirmar({ invalid: false });

    expect(itemService.ajustarQuantidade).toHaveBeenCalledWith('1', { tipo: 'SAIDA', quantidade: 5 });
    expect(dialogRef.close).toHaveBeenCalledWith(itemAtualizado);
  });

  it('shows the API message and keeps the dialog open on a 422', () => {
    const itemService = TestBed.inject(ItemService);
    const erro = new HttpErrorResponse({ status: 422, error: { mensagem: 'Saída maior que o estoque disponível' } });
    vi.spyOn(itemService, 'ajustarQuantidade').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(AjusteQuantidadeDialog);
    const componente = fixture.componentInstance;
    componente.tipo = 'SAIDA';
    componente.quantidade = 999;
    componente.confirmar({ invalid: false });

    expect(componente.erroGeral()).toBe('Saída maior que o estoque disponível');
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
