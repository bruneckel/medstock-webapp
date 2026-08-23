export interface CampoComErro {
  campo: string;
  erro: string;
}

export interface ErroResponse {
  timestamp: string;
  status: number;
  erro: string;
  mensagem: string;
  path: string;
  campos: CampoComErro[] | null;
}
