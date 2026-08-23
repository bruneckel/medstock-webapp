import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Fornecedor } from '../../../core/models';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

const COLUNAS = ['nome', 'cnpj', 'email', 'slaHoras', 'ativo', 'acoes'];

@Component({
  selector: 'app-fornecedores-lista',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './fornecedores-lista.html',
  styleUrl: './fornecedores-lista.css',
})
export class FornecedoresLista {
  private readonly fornecedorService = inject(FornecedorService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);

  readonly colunas = COLUNAS;
  readonly fornecedores = signal<Fornecedor[]>([]);
  readonly carregando = signal(true);

  readonly podeGerenciar = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR';
  });
  readonly podeInativar = computed(() => this.authService.perfil() === 'ADMIN');

  constructor() {
    this.carregar();
  }

  inativar(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titulo: 'Inativar fornecedor',
        mensagem: `Inativar "${fornecedor.nome}"? Pedidos existentes são preservados.`,
        rotuloConfirmar: 'Inativar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (!confirmado) {
        return;
      }
      this.fornecedorService.inativar(fornecedor.id).subscribe({
        next: () => {
          this.snackbar.sucesso('Fornecedor inativado.');
          this.carregar();
        },
        error: (erro: unknown) => this.snackbar.erro(extrairMensagemDeErro(erro)),
      });
    });
  }

  private carregar(): void {
    this.carregando.set(true);
    this.fornecedorService.listar().subscribe((fornecedores) => {
      this.fornecedores.set(fornecedores);
      this.carregando.set(false);
    });
  }
}
