import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AjusteQuantidadeRequest, Item, ItemAtualizacaoRequest, ItemCriacaoRequest, PaginaResponse, StatusItem } from '../models';

const BASE_URL = `${environment.apiUrl}/itens`;

export interface FiltrosItem {
  status?: StatusItem;
  categoria?: string;
  busca?: string;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosItem): Observable<PaginaResponse<Item>> {
    let params = new HttpParams();
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros.busca) params = params.set('busca', filtros.busca);
    params = params.set('page', filtros.page ?? 0).set('size', filtros.size ?? 20);

    return this.http.get<PaginaResponse<Item>>(BASE_URL, { params });
  }

  listarCriticos(): Observable<Item[]> {
    return this.http.get<Item[]>(`${BASE_URL}/criticos`);
  }

  listarVencendo(): Observable<Item[]> {
    return this.http.get<Item[]>(`${BASE_URL}/vencendo`);
  }

  buscarPorId(id: string): Observable<Item> {
    return this.http.get<Item>(`${BASE_URL}/${id}`);
  }

  criar(request: ItemCriacaoRequest): Observable<Item> {
    return this.http.post<Item>(BASE_URL, request);
  }

  atualizar(id: string, request: ItemAtualizacaoRequest): Observable<Item> {
    return this.http.put<Item>(`${BASE_URL}/${id}`, request);
  }

  ajustarQuantidade(id: string, request: AjusteQuantidadeRequest): Observable<Item> {
    return this.http.patch<Item>(`${BASE_URL}/${id}/quantidade`, request);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
