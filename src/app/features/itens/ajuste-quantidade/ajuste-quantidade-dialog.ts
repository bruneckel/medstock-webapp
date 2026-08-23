import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemService } from '../../../core/services/item.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Item, TipoMovimentacao } from '../../../core/models';

export interface AjusteQuantidadeDialogData {
  item: Item;
}

@Component({
  selector: 'app-ajuste-quantidade-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './ajuste-quantidade-dialog.html',
})
export class AjusteQuantidadeDialog {
  private readonly itemService = inject(ItemService);
  private readonly dialogRef = inject(MatDialogRef<AjusteQuantidadeDialog>);
  readonly data = inject<AjusteQuantidadeDialogData>(MAT_DIALOG_DATA);

  readonly salvando = signal(false);
  readonly erroGeral = signal<string | null>(null);

  tipo: TipoMovimentacao = 'ENTRADA';
  quantidade: number | null = null;

  confirmar(formulario: Pick<NgForm, 'invalid'>): void {
    if (formulario.invalid || this.quantidade === null) {
      return;
    }
    this.salvando.set(true);
    this.erroGeral.set(null);

    this.itemService
      .ajustarQuantidade(this.data.item.id, { tipo: this.tipo, quantidade: this.quantidade })
      .subscribe({
        next: (itemAtualizado) => {
          this.salvando.set(false);
          this.dialogRef.close(itemAtualizado);
        },
        error: (erro: unknown) => {
          this.salvando.set(false);
          this.erroGeral.set(extrairMensagemDeErro(erro));
        },
      });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
