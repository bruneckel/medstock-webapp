import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FornecedorForm } from './fornecedor-form';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { Fornecedor } from '../../../core/models';

describe('FornecedorForm', () => {
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

  function configurar(idNaRota: string | null) {
    TestBed.configureTestingModule({
      imports: [FornecedorForm],
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
  }

  it('creates a new fornecedor and navigates to the list', () => {
    configurar(null);
    const fornecedorService = TestBed.inject(FornecedorService);
    const criarSpy = vi.spyOn(fornecedorService, 'criar').mockReturnValue(of(fornecedorFalso));
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(FornecedorForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Farma Distribuidora';
    componente.cnpj = '12345678000199';
    componente.email = 'contato@farma.com.br';
    componente.slaHoras = 48;
    componente.salvar({ invalid: false });

    expect(criarSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/admin/fornecedores');
  });

  it('loads the fornecedor into the form fields when editing', () => {
    configurar('1');
    const fornecedorService = TestBed.inject(FornecedorService);
    vi.spyOn(fornecedorService, 'buscarPorId').mockReturnValue(of(fornecedorFalso));

    const fixture = TestBed.createComponent(FornecedorForm);

    expect(fixture.componentInstance.nome).toBe('Farma Distribuidora');
    expect(fixture.componentInstance.idEmEdicao()).toBe('1');
  });

  it('maps a duplicate CNPJ error onto the cnpj field', () => {
    configurar(null);
    const fornecedorService = TestBed.inject(FornecedorService);
    const erro = new HttpErrorResponse({
      status: 409,
      error: { mensagem: 'CNPJ já cadastrado', campos: [{ campo: 'cnpj', erro: 'já cadastrado' }] },
    });
    vi.spyOn(fornecedorService, 'criar').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(FornecedorForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Farma';
    componente.cnpj = '12345678000199';
    componente.email = 'contato@farma.com.br';
    componente.slaHoras = 48;
    componente.salvar({ invalid: false });

    expect(componente.errosDeCampo()['cnpj']).toBe('já cadastrado');
  });
});
