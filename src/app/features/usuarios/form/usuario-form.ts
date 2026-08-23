import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairErrosDeCampo, extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { PerfilUsuario } from '../../../core/models';

@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './usuario-form.html',
})
export class UsuarioForm {
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);

  readonly carregando = signal(false);
  readonly errosDeCampo = signal<Record<string, string>>({});

  nome = '';
  email = '';
  senha = '';
  matricula = '';
  departamento = '';
  cargo = '';
  registroProfissional = '';
  hospital = '';
  perfil: PerfilUsuario | '' = '';

  criar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid || !this.perfil) {
      return;
    }
    this.carregando.set(true);
    this.errosDeCampo.set({});

    this.authService
      .registrar({
        nome: this.nome,
        email: this.email,
        senha: this.senha,
        matricula: this.matricula || undefined,
        departamento: this.departamento || undefined,
        cargo: this.cargo || undefined,
        registroProfissional: this.registroProfissional || undefined,
        hospital: this.hospital || undefined,
        perfil: this.perfil,
      })
      .subscribe({
        next: () => {
          this.carregando.set(false);
          this.snackbar.sucesso('Usuário provisionado.');
          this.limparFormulario();
        },
        error: (erro: unknown) => {
          this.carregando.set(false);
          this.errosDeCampo.set(extrairErrosDeCampo(erro));
          this.snackbar.erro(extrairMensagemDeErro(erro));
        },
      });
  }

  private limparFormulario(): void {
    this.nome = '';
    this.email = '';
    this.senha = '';
    this.matricula = '';
    this.departamento = '';
    this.cargo = '';
    this.registroProfissional = '';
    this.hospital = '';
    this.perfil = '';
  }
}
