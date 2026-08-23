export type StatusItem = 'CRITICO' | 'ATENCAO' | 'NORMAL';
export type TipoItem = 'PRIMORDIAL' | 'ESSENCIAL_BAIXA_DEMANDA';
export type StatusPedido =
  | 'PENDENTE'
  | 'EM_ROTA'
  | 'ATRASADO'
  | 'ENTREGUE'
  | 'NAO_ENTREGUE'
  | 'EXTRAVIO_REEMBOLSO'
  | 'CANCELADO';
export type StatusAlerta = 'ATIVO' | 'RESOLVIDO' | 'IGNORADO';
export type TipoAlerta = 'ESTOQUE_CRITICO' | 'VALIDADE' | 'ATRASO_ENTREGA' | 'FRAUDE' | 'CATASTROFE' | 'IA';
export type SeveridadeAlerta = 'CRITICO' | 'ATENCAO' | 'INFO';
export type PerfilUsuario = 'ADMIN' | 'GESTOR' | 'FARMACEUTICO' | 'ENFERMEIRO';
export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';
