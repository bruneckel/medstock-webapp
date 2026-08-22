import { Alerta } from './alerta';
import { Pedido } from './pedido';

export interface ResumoEstoque {
  total: number;
  criticos: number;
  atencao: number;
  normais: number;
  vencendo: number;
}

export interface DashboardResumo {
  geradoEm: string;
  estoque: ResumoEstoque;
  pedidosDoDia: Pedido[];
  alertasRecentes: Alerta[];
}
