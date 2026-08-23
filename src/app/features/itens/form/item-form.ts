import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemService } from '../../../core/services/item.service';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairErrosDeCampo, extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Fornecedor, ItemCriacaoRequest, TipoItem } from '../../../core/models';
import { PrevisaoPanel } from '../previsao-panel/previsao-panel';

@Component({
  selector: 'app-item-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    PrevisaoPanel,
  ],
  templateUrl: './item-form.html',
})
export class ItemForm {
  private readonly itemService = inject(ItemService);
  private readonly fornecedorService = inject(FornecedorService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly idEmEdicao = signal<string | null>(null);
  readonly carregando = signal(false);
  readonly errosDeCampo = signal<Record<string, string>>({});
  readonly fornecedores = signal<Fornecedor[]>([]);

  nome = '';
  descricao = '';
  categoria = '';
  unidadeMedida = '';
  quantidadeAtual: number | null = null;
  quantidadeMinima: number | null = null;
  quantidadeMaxima: number | null = null;
  quantidadeRecomendadaIa: number | null = null;
  localArmazenamento = '';
  fornecedorId = '';
  tipo: TipoItem | '' = '';
  lote = '';
  dataValidade = '';

  constructor() {
    this.fornecedorService.listar().subscribe((fornecedores) => this.fornecedores.set(fornecedores));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEmEdicao.set(id);
      this.itemService.buscarPorId(id).subscribe((item) => {
        this.nome = item.nome;
        this.descricao = item.descricao;
        this.categoria = item.categoria;
        this.unidadeMedida = item.unidadeMedida;
        this.quantidadeAtual = item.quantidadeAtual;
        this.quantidadeMinima = item.quantidadeMinima;
        this.quantidadeMaxima = item.quantidadeMaxima;
        this.quantidadeRecomendadaIa = item.quantidadeRecomendadaIa;
        this.localArmazenamento = item.localArmazenamento;
        this.fornecedorId = item.fornecedorId;
        this.tipo = item.tipo;
        this.lote = item.lote;
        this.dataValidade = item.dataValidade;
      });
    }
  }

  salvar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid || this.quantidadeAtual === null || this.quantidadeMinima === null) {
      return;
    }
    this.carregando.set(true);
    this.errosDeCampo.set({});

    const request: ItemCriacaoRequest = {
      nome: this.nome,
      descricao: this.descricao,
      categoria: this.categoria,
      unidadeMedida: this.unidadeMedida,
      quantidadeAtual: this.quantidadeAtual,
      quantidadeMinima: this.quantidadeMinima,
      quantidadeMaxima: this.quantidadeMaxima,
      quantidadeRecomendadaIa: this.quantidadeRecomendadaIa,
      localArmazenamento: this.localArmazenamento,
      fornecedorId: this.fornecedorId,
      tipo: this.tipo || null,
      lote: this.lote,
      dataValidade: this.dataValidade,
    };

    const id = this.idEmEdicao();
    const operacao = id ? this.itemService.atualizar(id, request) : this.itemService.criar(request);

    operacao.subscribe({
      next: () => {
        this.carregando.set(false);
        this.snackbar.sucesso(id ? 'Item atualizado.' : 'Item cadastrado.');
        this.router.navigateByUrl('/admin/itens');
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.errosDeCampo.set(extrairErrosDeCampo(erro));
        this.snackbar.erro(extrairMensagemDeErro(erro));
      },
    });
  }
}
