import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FornecedoresLista } from './fornecedores-lista';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { Fornecedor } from '../../../core/models';

describe('FornecedoresLista', () => {
  const fornecedorFalso: Fornecedor = {
    id: '1',
    nome: 'Farma Distribuidora',
    cnpj: '12345678000199',
    email: 'contato@farma.com.br',
    telefone: null,
    slaHoras: 48,
    scoreConfiabilidade: 90,
    historicoAtrasos: 0,
    ativo: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FornecedoresLista],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    });
  });

  it('loads fornecedores on init', () => {
    const fornecedorService = TestBed.inject(FornecedorService);
    vi.spyOn(fornecedorService, 'listar').mockReturnValue(of([fornecedorFalso]));

    const fixture = TestBed.createComponent(FornecedoresLista);
    fixture.detectChanges();

    expect(fixture.componentInstance.fornecedores()).toEqual([fornecedorFalso]);
  });

  it('inativa a fornecedor after confirming', () => {
    const fornecedorService = TestBed.inject(FornecedorService);
    vi.spyOn(fornecedorService, 'listar').mockReturnValue(of([fornecedorFalso]));
    const inativarSpy = vi.spyOn(fornecedorService, 'inativar').mockReturnValue(of(undefined));

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as never);

    const fixture = TestBed.createComponent(FornecedoresLista);
    fixture.detectChanges();
    fixture.componentInstance.inativar(fornecedorFalso);

    expect(inativarSpy).toHaveBeenCalledWith('1');
  });
});
