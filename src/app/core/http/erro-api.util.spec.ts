import { HttpErrorResponse } from '@angular/common/http';
import { extrairErrosDeCampo, extrairMensagemDeErro } from './erro-api.util';

describe('erro-api.util', () => {
  it('maps campos[] into a record keyed by field name', () => {
    const erro = new HttpErrorResponse({
      status: 400,
      error: {
        mensagem: 'Falha de validação',
        campos: [
          { campo: 'email', erro: 'deve ser um endereço de e-mail válido' },
          { campo: 'senha', erro: 'deve ter no mínimo 8 caracteres' },
        ],
      },
    });

    expect(extrairErrosDeCampo(erro)).toEqual({
      email: 'deve ser um endereço de e-mail válido',
      senha: 'deve ter no mínimo 8 caracteres',
    });
  });

  it('returns an empty record when there is no campos array', () => {
    const erro = new HttpErrorResponse({ status: 500, error: { mensagem: 'Erro interno' } });
    expect(extrairErrosDeCampo(erro)).toEqual({});
  });

  it('returns an empty record for a non-HTTP error', () => {
    expect(extrairErrosDeCampo(new Error('falha de rede'))).toEqual({});
  });

  it('extracts the API message when present', () => {
    const erro = new HttpErrorResponse({ status: 422, error: { mensagem: 'Fornecedor inativo' } });
    expect(extrairMensagemDeErro(erro)).toBe('Fornecedor inativo');
  });

  it('falls back to a generic message otherwise', () => {
    expect(extrairMensagemDeErro(new Error('falha de rede'))).toBe(
      'Não foi possível completar a operação.',
    );
  });
});
