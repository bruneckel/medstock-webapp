import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Previsao } from '../models';

const BASE_URL = `${environment.apiUrl}/previsoes`;

@Injectable({ providedIn: 'root' })
export class PrevisaoService {
  private readonly http = inject(HttpClient);

  buscarPorItem(itemId: string): Observable<Previsao> {
    return this.http.get<Previsao>(`${BASE_URL}/${itemId}`);
  }

  gerar(itemId: string): Observable<Previsao> {
    return this.http.post<Previsao>(`${BASE_URL}/${itemId}/gerar`, {});
  }
}
