import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';
import { extrairErrosDeCampo, extrairMensagemDeErro } from '../../../core/http/erro-api.util';

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './registro.html',
  styleUrl: '../login/login.css',
})
export class Registro {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nome = '';
  email = '';
  senha = '';
  readonly carregando = signal(false);
  readonly erroGeral = signal<string | null>(null);
  readonly errosDeCampo = signal<Record<string, string>>({});

  registrar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid) {
      return;
    }
    this.carregando.set(true);
    this.erroGeral.set(null);
    this.errosDeCampo.set({});

    this.authService.registrar({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.errosDeCampo.set(extrairErrosDeCampo(erro));
        this.erroGeral.set(extrairMensagemDeErro(erro));
      },
    });
  }
}
