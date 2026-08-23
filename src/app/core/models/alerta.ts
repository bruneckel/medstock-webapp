import { SeveridadeAlerta, StatusAlerta, TipoAlerta } from './enums';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  severidade: SeveridadeAlerta;
  titulo: string;
  mensagem: string;
  itemId: string | null;
  pedidoId: string | null;
  status: StatusAlerta;
  acaoTomada: string | null;
  criadoEm: string;
  resolvidoEm: string | null;
}

export interface AlertaRequest {
  tipo: TipoAlerta;
  severidade: SeveridadeAlerta;
  titulo: string;
  mensagem: string;
  itemId?: string;
  pedidoId?: string;
}
