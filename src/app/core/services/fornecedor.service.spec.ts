import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FornecedorService } from './fornecedor.service';
import { environment } from '../../../environments/environment';
import { Fornecedor } from '../models';

describe('FornecedorService', () => {
  let service: FornecedorService;
  let httpMock: HttpTestingController;

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
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FornecedorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lists all fornecedores', () => {
    service.listar().subscribe((lista) => expect(lista).toEqual([fornecedorFalso]));
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/fornecedores`);
    expect(requisicao.request.method).toBe('GET');
    requisicao.flush([fornecedorFalso]);
  });

  it('inativa a fornecedor via DELETE', () => {
    service.inativar('1').subscribe();
    const requisicao = httpMock.expectOne(`${environment.apiUrl}/fornecedores/1`);
    expect(requisicao.request.method).toBe('DELETE');
    requisicao.flush(null);
  });
});
