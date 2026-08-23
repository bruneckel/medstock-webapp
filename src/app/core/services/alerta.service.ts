import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Alerta, AlertaRequest, SeveridadeAlerta, StatusAlerta, TipoAlerta } from '../models';

const BASE_URL = `${environment.apiUrl}/alertas`;

export interface FiltrosAlerta {
  tipo?: TipoAlerta;
  severidade?: SeveridadeAlerta;
  status?: StatusAlerta;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosAlerta): Observable<Alerta[]> {
    let params = new HttpParams();
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.severidade) params = params.set('severidade', filtros.severidade);
    if (filtros.status) params = params.set('status', filtros.status);
    return this.http.get<Alerta[]>(BASE_URL, { params });
  }

  buscarPorId(id: string): Observable<Alerta> {
    return this.http.get<Alerta>(`${BASE_URL}/${id}`);
  }

  criar(request: AlertaRequest): Observable<Alerta> {
    return this.http.post<Alerta>(BASE_URL, request);
  }

  gerar(): Observable<Alerta[]> {
    return this.http.post<Alerta[]>(`${BASE_URL}/gerar`, {});
  }

  resolver(id: string): Observable<Alerta> {
    return this.http.patch<Alerta>(`${BASE_URL}/${id}/resolver`, {});
  }

  ignorar(id: string): Observable<Alerta> {
    return this.http.patch<Alerta>(`${BASE_URL}/${id}/ignorar`, {});
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
