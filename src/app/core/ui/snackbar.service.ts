import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURACAO_MS = 4000;

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  sucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: DURACAO_MS,
      panelClass: ['snackbar-sucesso'],
    });
  }

  erro(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: DURACAO_MS,
      panelClass: ['snackbar-erro'],
    });
  }
}
