import { HttpErrorResponse } from '@angular/common/http';
import { CampoComErro } from '../models';

export function extrairErrosDeCampo(erro: unknown): Record<string, string> {
  if (!(erro instanceof HttpErrorResponse)) {
    return {};
  }
  const corpo = erro.error as { campos?: CampoComErro[] } | null;
  if (!corpo?.campos) {
    return {};
  }
  return Object.fromEntries(corpo.campos.map((campo) => [campo.campo, campo.erro]));
}

export function extrairMensagemDeErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse) {
    const corpo = erro.error as { mensagem?: string } | null;
    if (corpo?.mensagem) {
      return corpo.mensagem;
    }
  }
  return 'Não foi possível completar a operação.';
}
