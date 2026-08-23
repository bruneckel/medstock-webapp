export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string | null;
  slaHoras: number;
  scoreConfiabilidade: number | null;
  historicoAtrasos: number;
  ativo: boolean;
}

export interface FornecedorRequest {
  nome: string;
  cnpj: string;
  email: string;
  telefone?: string;
  slaHoras: number;
  scoreConfiabilidade?: number;
}
