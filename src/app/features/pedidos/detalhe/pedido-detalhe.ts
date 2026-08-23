import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Fornecedor, Pedido, StatusPedido } from '../../../core/models';
import { StatusTag } from '../../../shared/components/status-tag/status-tag';

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
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);

  readonly statusDisponiveis = STATUS_DISPONIVEIS_PARA_PATCH;
  readonly pedido = signal<Pedido | null>(null);
  readonly fornecedores = signal<Fornecedor[]>([]);
  readonly carregando = signal(true);
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
    const id = this.route.snapshot.paramMap.get('id')!;
    this.carregar(id);
  }

  nomeFornecedor(fornecedorId: string): string {
    return this.fornecedores().find((f) => f.id === fornecedorId)?.nome ?? fornecedorId;
  }

  confirmar(): void {
    const atual = this.pedido();
    if (!atual) {
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
    this.pedidoService.buscarPorId(id).subscribe((pedido) => {
      this.pedido.set(pedido);
      this.carregando.set(false);
    });
  }
}
