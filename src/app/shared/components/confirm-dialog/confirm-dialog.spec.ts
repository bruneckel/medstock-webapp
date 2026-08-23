import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let dialogRef: { close: (resultado?: boolean) => void };

  const criarComponente = (data: ConfirmDialogData) => {
    dialogRef = { close: vi.fn() };
    TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });
    return TestBed.createComponent(ConfirmDialog);
  };

  it('closes with true on confirmar()', () => {
    const fixture = criarComponente({ titulo: 'Excluir item', mensagem: 'Tem certeza?' });
    fixture.componentInstance.confirmar();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes with false on cancelar()', () => {
    const fixture = criarComponente({ titulo: 'Excluir item', mensagem: 'Tem certeza?' });
    fixture.componentInstance.cancelar();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
