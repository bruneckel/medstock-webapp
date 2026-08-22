import { StatusItem, TipoItem, TipoMovimentacao } from './enums';

export interface Item {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima: number | null;
  quantidadeRecomendadaIa: number | null;
  localArmazenamento: string;
  fornecedorId: string;
  tipo: TipoItem;
  lote: string;
  dataValidade: string;
  status: StatusItem;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemCriacaoRequest {
  nome: string;
  descricao: string;
  categoria: string;
  unidadeMedida: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeMaxima: number | null;
  quantidadeRecomendadaIa: number | null;
  localArmazenamento: string;
  fornecedorId: string;
  tipo: TipoItem | null;
  lote: string;
  dataValidade: string;
}

export type ItemAtualizacaoRequest = ItemCriacaoRequest;

export interface AjusteQuantidadeRequest {
  tipo: TipoMovimentacao;
  quantidade: number;
}
