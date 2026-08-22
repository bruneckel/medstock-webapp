import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from '../../../core/services/item.service';
import { AuthService } from '../../../core/auth/auth.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Item, StatusItem } from '../../../core/models';
import { StatusTag } from '../../../shared/components/status-tag/status-tag';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

type Aba = 'todos' | 'criticos' | 'vencendo';

const COLUNAS = ['nome', 'categoria', 'quantidadeAtual', 'status', 'acoes'];

@Component({
  selector: 'app-itens-lista',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    StatusTag,
  ],
  templateUrl: './itens-lista.html',
  styleUrl: './itens-lista.css',
})
export class ItensLista {
  private readonly itemService = inject(ItemService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);

  readonly colunas = COLUNAS;
  readonly itens = signal<Item[]>([]);
  readonly carregando = signal(true);
  readonly totalElementos = signal(0);
  readonly pagina = signal(0);
  readonly tamanho = signal(20);
  readonly aba = signal<Aba>('todos');

  status: StatusItem | '' = '';
  categoria = '';
  busca = '';

  readonly podeGerenciar = computed(() => {
    const perfil = this.authService.perfil();
    return perfil === 'ADMIN' || perfil === 'GESTOR' || perfil === 'FARMACEUTICO';
  });
  readonly podeExcluir = computed(() => this.authService.perfil() === 'ADMIN');

  constructor() {
    this.carregar();
  }

  mudarAba(indice: number): void {
    this.aba.set(indice === 1 ? 'criticos' : indice === 2 ? 'vencendo' : 'todos');
    this.pagina.set(0);
    this.carregar();
  }

  aplicarFiltros(): void {
    this.pagina.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pagina.set(evento.pageIndex);
    this.tamanho.set(evento.pageSize);
    this.carregar();
  }

  excluir(item: Item): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        titulo: 'Excluir item',
        mensagem: `Remover "${item.nome}" do estoque?`,
        rotuloConfirmar: 'Excluir',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (!confirmado) {
        return;
      }
      this.itemService.remover(item.id).subscribe({
        next: () => {
          this.snackbar.sucesso('Item removido.');
          this.carregar();
        },
        error: (erro: unknown) => this.snackbar.erro(extrairMensagemDeErro(erro)),
      });
    });
  }

  private carregar(): void {
    this.carregando.set(true);

    if (this.aba() === 'criticos') {
      this.itemService.listarCriticos().subscribe((itens) => this.aplicarListaSimples(itens));
      return;
    }
    if (this.aba() === 'vencendo') {
      this.itemService.listarVencendo().subscribe((itens) => this.aplicarListaSimples(itens));
      return;
    }

    this.itemService
      .listar({
        status: this.status || undefined,
        categoria: this.categoria || undefined,
        busca: this.busca || undefined,
        page: this.pagina(),
        size: this.tamanho(),
      })
      .subscribe((resposta) => {
        this.itens.set(resposta.conteudo);
        this.totalElementos.set(resposta.totalElementos);
        this.carregando.set(false);
      });
  }

  private aplicarListaSimples(itens: Item[]): void {
    this.itens.set(itens);
    this.totalElementos.set(itens.length);
    this.carregando.set(false);
  }
}
