import { PerfilUsuario } from './enums';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  departamento: string;
  cargo: string;
  registroProfissional: string;
  hospital: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  criadoEm: string;
}

export interface TokenResponse {
  token: string;
  tipo: string;
  expiraEm: string;
  usuario: Usuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
  matricula?: string;
  departamento?: string;
  cargo?: string;
  registroProfissional?: string;
  hospital?: string;
  perfil?: PerfilUsuario;
}
