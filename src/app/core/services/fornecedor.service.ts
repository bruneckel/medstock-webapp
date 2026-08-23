import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fornecedor, FornecedorRequest } from '../models';

const BASE_URL = `${environment.apiUrl}/fornecedores`;

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(BASE_URL);
  }

  buscarPorId(id: string): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${BASE_URL}/${id}`);
  }

  criar(request: FornecedorRequest): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(BASE_URL, request);
  }

  atualizar(id: string, request: FornecedorRequest): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${BASE_URL}/${id}`, request);
  }

  inativar(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
