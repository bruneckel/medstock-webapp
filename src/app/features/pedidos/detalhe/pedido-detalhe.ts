import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ItemService } from '../../../core/services/item.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Fornecedor, Item, Pedido, StatusPedido } from '../../../core/models';
import { StatusTag } from '../../../shared/components/status-tag/status-tag';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

const STATUS_DISPONIVEIS_PARA_PATCH: StatusPedido[] = [
  'PENDENTE',
  'EM_ROTA',
  'ATRASADO',
  'NAO_ENTREGUE',
  'EXTRAVIO_REEMBOLSO',
  'CANCELADO',
];

@Component({
  selector: 'app-pedido-detalhe',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, StatusTag],
  templateUrl: './pedido-detalhe.html',
  styleUrl: './pedido-detalhe.css',
})
export class PedidoDetalhe {
  private readonly pedidoService = inject(PedidoService);
  private readonly fornecedorService = inject(FornecedorService);
  private readonly itemService = inject(ItemService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  readonly statusDisponiveis = STATUS_DISPONIVEIS_PARA_PATCH;
  readonly pedido = signal<Pedido | null>(null);
  readonly fornecedores = signal<Fornecedor[]>([]);
  readonly itens = signal<Item[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly atualizandoStatus = signal(false);
  readonly confirmando = signal(false);

  novoStatus: StatusPedido | '' = '';

  readonly podeConfirmar = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR' || perfil === 'FARMACEUTICO';
  });
  readonly podeMudarStatus = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR';
  });

  constructor() {
    this.fornecedorService.listar().subscribe((fornecedores) => this.fornecedores.set(fornecedores));
    this.itemService.listar({ page: 0, size: 100 }).subscribe((pagina) => this.itens.set(pagina.conteudo));
    const id = this.route.snapshot.paramMap.get('id')!;
    this.carregar(id);
  }

  nomeFornecedor(fornecedorId: string): string {
    return this.fornecedores().find((f) => f.id === fornecedorId)?.nome ?? fornecedorId;
  }

  nomeItem(itemId: string): string {
    return this.itens().find((i) => i.id === itemId)?.nome ?? itemId;
  }

  confirmar(): void {
    const atual = this.pedido();
    if (!atual) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titulo: 'Confirmar recebimento',
        mensagem: `Confirmar o recebimento do pedido ${atual.codigo}? O estoque será atualizado.`,
        rotuloConfirmar: 'Confirmar',
      },
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (!confirmado) {
        return;
      }
      this.confirmando.set(true);
      this.pedidoService.confirmar(atual.id).subscribe({
        next: (pedidoAtualizado) => {
          this.confirmando.set(false);
          this.pedido.set(pedidoAtualizado);
          this.snackbar.sucesso('Pedido confirmado e estoque atualizado.');
        },
        error: (erro: unknown) => {
          this.confirmando.set(false);
          this.snackbar.erro(extrairMensagemDeErro(erro));
        },
      });
    });
  }

  mudarStatus(): void {
    const atual = this.pedido();
    if (!atual || !this.novoStatus) {
      return;
    }
    this.atualizandoStatus.set(true);
    this.pedidoService.atualizarStatus(atual.id, { status: this.novoStatus }).subscribe({
      next: (pedidoAtualizado) => {
        this.atualizandoStatus.set(false);
        this.pedido.set(pedidoAtualizado);
        this.snackbar.sucesso('Status atualizado.');
      },
      error: (erro: unknown) => {
        this.atualizandoStatus.set(false);
        this.snackbar.erro(extrairMensagemDeErro(erro));
      },
    });
  }

  private carregar(id: string): void {
    this.carregando.set(true);
    this.pedidoService.buscarPorId(id).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
        this.erro.set(null);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar o pedido.');
        this.carregando.set(false);
      },
    });
  }
}
