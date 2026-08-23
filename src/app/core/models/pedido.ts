import { StatusPedido } from './enums';

export interface ItemPedido {
  itemId: string;
  quantidade: number;
  valorUnitario: number | null;
}

export interface Pedido {
  id: string;
  codigo: string;
  fornecedorId: string;
  status: StatusPedido;
  dataPedido: string;
  etaPrevista: string;
  dataEntrega: string | null;
  reentregaPrevistaEm: string | null;
  slaHoras: number;
  valorTotal: number;
  valorReembolso: number | null;
  motivoAtraso: string | null;
  motivoOcorrencia: string | null;
  itens: ItemPedido[];
  slaExcedido: boolean;
}

export interface ItemPedidoRequest {
  itemId: string;
  quantidade: number;
  valorUnitario?: number;
}

export interface PedidoRequest {
  fornecedorId: string;
  etaPrevista: string;
  slaHoras?: number;
  itens: ItemPedidoRequest[];
}

export interface AtualizacaoStatusRequest {
  status: StatusPedido;
}
