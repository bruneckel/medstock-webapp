import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegistroRequest, TokenResponse, Usuario } from '../models';

const CHAVE_SESSAO = 'medstock.sessao';

interface SessaoPersistida {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _token = signal<string | null>(null);
  private readonly _usuario = signal<Usuario | null>(null);

  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly perfil = computed(() => this._usuario()?.perfil ?? null);

  constructor() {
    const sessao = this.lerSessaoPersistida();
    if (sessao) {
      this._token.set(sessao.token);
      this._usuario.set(sessao.usuario);
    }
  }

  token(): string | null {
    return this._token();
  }

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((resposta) => this.persistirSessao(resposta)));
  }

  registrar(request: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/auth/registro`, request);
  }

  logout(): void {
    this._token.set(null);
    this._usuario.set(null);
    localStorage.removeItem(CHAVE_SESSAO);
  }

  private persistirSessao(resposta: TokenResponse): void {
    this._token.set(resposta.token);
    this._usuario.set(resposta.usuario);
    const sessao: SessaoPersistida = { token: resposta.token, usuario: resposta.usuario };
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  }

  private lerSessaoPersistida(): SessaoPersistida | null {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    if (!bruto) {
      return null;
    }
    try {
      return JSON.parse(bruto) as SessaoPersistida;
    } catch {
      return null;
    }
  }
}
