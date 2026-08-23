import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PedidoService } from '../../../core/services/pedido.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Fornecedor, Pedido, StatusPedido } from '../../../core/models';
import { StatusTag } from '../../../shared/components/status-tag/status-tag';

const COLUNAS = ['codigo', 'fornecedor', 'status', 'etaPrevista', 'valorTotal', 'acoes'];

@Component({
  selector: 'app-pedidos-lista',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    StatusTag,
  ],
  templateUrl: './pedidos-lista.html',
  styleUrl: './pedidos-lista.css',
})
export class PedidosLista {
  private readonly pedidoService = inject(PedidoService);
  private readonly fornecedorService = inject(FornecedorService);
  private readonly authService = inject(AuthService);

  readonly colunas = COLUNAS;
  readonly pedidos = signal<Pedido[]>([]);
  readonly fornecedores = signal<Fornecedor[]>([]);
  readonly carregando = signal(true);

  status: StatusPedido | '' = '';
  somenteAtrasados = false;

  readonly podeCriar = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR' || perfil === 'FARMACEUTICO';
  });

  constructor() {
    this.fornecedorService.listar().subscribe((fornecedores) => this.fornecedores.set(fornecedores));
    this.carregar();
  }

  nomeFornecedor(fornecedorId: string): string {
    return this.fornecedores().find((f) => f.id === fornecedorId)?.nome ?? fornecedorId;
  }

  aplicarFiltros(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    const observable = this.somenteAtrasados
      ? this.pedidoService.listarAtrasados()
      : this.pedidoService.listar({ status: this.status || undefined });

    observable.subscribe((pedidos) => {
      this.pedidos.set(pedidos);
      this.carregando.set(false);
    });
  }
}
