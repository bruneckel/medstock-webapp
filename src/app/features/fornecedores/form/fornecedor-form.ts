import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FornecedorService } from '../../../core/services/fornecedor.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairErrosDeCampo, extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { FornecedorRequest } from '../../../core/models';

@Component({
  selector: 'app-fornecedor-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './fornecedor-form.html',
})
export class FornecedorForm {
  private readonly fornecedorService = inject(FornecedorService);
  private readonly snackbar = inject(SnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly idEmEdicao = signal<string | null>(null);
  readonly carregando = signal(false);
  readonly errosDeCampo = signal<Record<string, string>>({});

  nome = '';
  cnpj = '';
  email = '';
  telefone = '';
  slaHoras: number | null = null;
  scoreConfiabilidade: number | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idEmEdicao.set(id);
      this.fornecedorService.buscarPorId(id).subscribe((fornecedor) => {
        this.nome = fornecedor.nome;
        this.cnpj = fornecedor.cnpj;
        this.email = fornecedor.email;
        this.telefone = fornecedor.telefone ?? '';
        this.slaHoras = fornecedor.slaHoras;
        this.scoreConfiabilidade = fornecedor.scoreConfiabilidade;
      });
    }
  }

  salvar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid || this.slaHoras === null) {
      return;
    }
    this.carregando.set(true);
    this.errosDeCampo.set({});

    const request: FornecedorRequest = {
      nome: this.nome,
      cnpj: this.cnpj,
      email: this.email,
      telefone: this.telefone || undefined,
      slaHoras: this.slaHoras,
      scoreConfiabilidade: this.scoreConfiabilidade ?? undefined,
    };

    const id = this.idEmEdicao();
    const operacao = id
      ? this.fornecedorService.atualizar(id, request)
      : this.fornecedorService.criar(request);

    operacao.subscribe({
      next: () => {
        this.carregando.set(false);
        this.snackbar.sucesso(id ? 'Fornecedor atualizado.' : 'Fornecedor cadastrado.');
        this.router.navigateByUrl('/admin/fornecedores');
      },
      error: (erro: unknown) => {
        this.carregando.set(false);
        this.errosDeCampo.set(extrairErrosDeCampo(erro));
        this.snackbar.erro(extrairMensagemDeErro(erro));
      },
    });
  }
}
