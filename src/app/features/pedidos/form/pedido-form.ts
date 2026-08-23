import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { ItemService } from '../../../core/services/item.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Fornecedor, Item, PedidoRequest } from '../../../core/models';

interface LinhaItemPedido {
  itemId: string;
  quantidade: number | null;
  valorUnitario: number | null;
}

@Component({
  selector: 'app-pedido-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pedido-form.html',
})
export class PedidoForm {
  private readonly pedidoService = inject(PedidoService);
  private readonly fornecedorService = inject(FornecedorService);
  private readonly itemService = inject(ItemService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  readonly fornecedores = signal<Fornecedor[]>([]);
  readonly itensDisponiveis = signal<Item[]>([]);
  readonly carregando = signal(false);
  readonly erroGeral = signal<string | null>(null);

  fornecedorId = '';
  etaPrevista = '';
  slaHoras: number | null = null;
  itensPedido: LinhaItemPedido[] = [{ itemId: '', quantidade: null, valorUnitario: null }];

  constructor() {
    this.fornecedorService.listar().subscribe((fornecedores) => this.fornecedores.set(fornecedores));
    this.itemService
      .listar({ page: 0, size: 100 })
      .subscribe((pagina) => this.itensDisponiveis.set(pagina.conteudo));
  }

  adicionarLinha(): void {
    this.itensPedido = [...this.itensPedido, { itemId: '', quantidade: null, valorUnitario: null }];
  }

  removerLinha(indice: number): void {
    this.itensPedido = this.itensPedido.filter((_, i) => i !== indice);
  }

  salvar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid) {
      return;
    }
    const itensValidos = this.itensPedido.filter((linha) => linha.itemId && linha.quantidade);
    if (itensValidos.length === 0) {
      this.erroGeral.set('Adicione ao menos um item ao pedido.');
      return;
    }

    this.carregando.set(true);
    this.erroGeral.set(null);

    const request: PedidoRequest = {
      fornecedorId: this.fornecedorId,
      etaPrevista: new Date(this.etaPrevista).toISOString(),
      slaHoras: this.slaHoras ?? undefined,
      itens: itensValidos.map((linha) => ({
        itemId: linha.itemId,
        quantidade: linha.quantidade as number,
        valorUnitario: linha.valorUnitario ?? undefined,
      })),
    };

    this.pedidoService.criar(request).subscribe({
      next: () => {
        this.carregando.set(false);
        this.snackbar.sucesso('Pedido criado.');
        this.router.navigateByUrl('/admin/pedidos');
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.erroGeral.set(extrairMensagemDeErro(erro));
      },
    });
  }
}
