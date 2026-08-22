export interface PontoSerie {
  periodo: string;
  valor: number;
}

export interface Previsao {
  id: string;
  itemId: string;
  geradoEm: string;
  historico: PontoSerie[];
  previsao: PontoSerie[];
  recomendacao: string;
  fatoresConsiderados: string[];
}
