import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UsuarioForm } from './usuario-form';
import { AuthService } from '../../../core/auth/auth.service';
import { Usuario } from '../../../core/models';

describe('UsuarioForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsuarioForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('provisions a new institutional user and resets the form', () => {
    const authService = TestBed.inject(AuthService);
    const registrarSpy = vi.spyOn(authService, 'registrar').mockReturnValue(of({} as Usuario));

    const fixture = TestBed.createComponent(UsuarioForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Novo Enfermeiro';
    componente.email = 'enfermeiro@fiap.com.br';
    componente.senha = 'senha1234';
    componente.perfil = 'ENFERMEIRO';
    componente.criar({ invalid: false });

    expect(registrarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'enfermeiro@fiap.com.br', perfil: 'ENFERMEIRO' }),
    );
    expect(componente.nome).toBe('');
  });

  it('maps a duplicate email error onto the email field', () => {
    const authService = TestBed.inject(AuthService);
    const erro = new HttpErrorResponse({
      status: 409,
      error: { mensagem: 'E-mail já cadastrado', campos: [{ campo: 'email', erro: 'já cadastrado' }] },
    });
    vi.spyOn(authService, 'registrar').mockReturnValue(throwError(() => erro));

    const fixture = TestBed.createComponent(UsuarioForm);
    const componente = fixture.componentInstance;
    componente.nome = 'Ana';
    componente.email = 'ana@fiap.com.br';
    componente.senha = 'senha1234';
    componente.perfil = 'ADMIN';
    componente.criar({ invalid: false });

    expect(componente.errosDeCampo()['email']).toBe('já cadastrado');
  });
});
