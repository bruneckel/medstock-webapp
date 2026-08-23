import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtualizacaoStatusRequest, Pedido, PedidoRequest, StatusPedido } from '../models';

const BASE_URL = `${environment.apiUrl}/pedidos`;

export interface FiltrosPedido {
  status?: StatusPedido;
  fornecedorId?: string;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosPedido): Observable<Pedido[]> {
    let params = new HttpParams();
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.fornecedorId) params = params.set('fornecedorId', filtros.fornecedorId);
    return this.http.get<Pedido[]>(BASE_URL, { params });
  }

  listarAtrasados(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${BASE_URL}/atrasados`);
  }

  buscarPorId(id: string): Observable<Pedido> {
    return this.http.get<Pedido>(`${BASE_URL}/${id}`);
  }

  criar(request: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(BASE_URL, request);
  }

  atualizarStatus(id: string, request: AtualizacaoStatusRequest): Observable<Pedido> {
    return this.http.patch<Pedido>(`${BASE_URL}/${id}/status`, request);
  }

  confirmar(id: string): Observable<Pedido> {
    return this.http.post<Pedido>(`${BASE_URL}/${id}/confirmar`, {});
  }
}
