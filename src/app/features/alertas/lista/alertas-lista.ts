import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AlertaService } from '../../../core/services/alerta.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Alerta, SeveridadeAlerta, StatusAlerta, TipoAlerta } from '../../../core/models';
import { StatusTag } from '../../../shared/components/status-tag/status-tag';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

const COLUNAS = ['titulo', 'tipo', 'severidade', 'status', 'acoes'];

@Component({
  selector: 'app-alertas-lista',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    StatusTag,
  ],
  templateUrl: './alertas-lista.html',
  styleUrl: './alertas-lista.css',
})
export class AlertasLista {
  private readonly alertaService = inject(AlertaService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);

  readonly colunas = COLUNAS;
  readonly alertas = signal<Alerta[]>([]);
  readonly carregando = signal(true);
  readonly gerando = signal(false);
  readonly erro = signal<string | null>(null);

  tipo: TipoAlerta | '' = '';
  severidade: SeveridadeAlerta | '' = '';
  status: StatusAlerta | '' = '';

  readonly podeGerenciar = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR';
  });
  readonly podeRemover = computed(() => this.authService.perfil() === 'ADMIN');

  constructor() {
    this.carregar();
  }

  aplicarFiltros(): void {
    this.carregar();
  }

  gerar(): void {
    this.gerando.set(true);
    this.alertaService.gerar().subscribe({
      next: (novos) => {
        this.gerando.set(false);
        this.snackbar.sucesso(
          novos.length ? `${novos.length} novo(s) alerta(s) gerado(s).` : 'Nenhum alerta novo.',
        );
        this.carregar();
      },
      error: (erro: unknown) => {
        this.gerando.set(false);
        this.snackbar.erro(extrairMensagemDeErro(erro));
      },
    });
  }

  resolver(alerta: Alerta): void {
    this.alertaService.resolver(alerta.id).subscribe({
      next: () => {
        this.snackbar.sucesso('Alerta resolvido.');
        this.carregar();
      },
      error: (erro: unknown) => this.snackbar.erro(extrairMensagemDeErro(erro)),
    });
  }

  ignorar(alerta: Alerta): void {
    this.alertaService.ignorar(alerta.id).subscribe({
      next: () => {
        this.snackbar.sucesso('Alerta ignorado.');
        this.carregar();
      },
      error: (erro: unknown) => this.snackbar.erro(extrairMensagemDeErro(erro)),
    });
  }

  remover(alerta: Alerta): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titulo: 'Remover alerta',
        mensagem: `Remover o alerta "${alerta.titulo}"?`,
        rotuloConfirmar: 'Remover',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (!confirmado) {
        return;
      }
      this.alertaService.remover(alerta.id).subscribe({
        next: () => {
          this.snackbar.sucesso('Alerta removido.');
          this.carregar();
        },
        error: (erro: unknown) => this.snackbar.erro(extrairMensagemDeErro(erro)),
      });
    });
  }

  private carregar(): void {
    this.carregando.set(true);
    this.alertaService
      .listar({
        tipo: this.tipo || undefined,
        severidade: this.severidade || undefined,
        status: this.status || undefined,
      })
      .subscribe({
        next: (alertas) => {
          this.alertas.set(alertas);
          this.erro.set(null);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set('Não foi possível carregar os alertas.');
          this.carregando.set(false);
        },
      });
  }
}
