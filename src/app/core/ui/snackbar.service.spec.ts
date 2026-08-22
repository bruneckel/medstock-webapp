import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideAnimationsAsync()] });
    service = TestBed.inject(SnackbarService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('opens a snackbar with the success class on sucesso()', () => {
    const spy = vi.spyOn(snackBar, 'open');
    service.sucesso('Item salvo com sucesso');
    expect(spy).toHaveBeenCalledWith(
      'Item salvo com sucesso',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-sucesso'] }),
    );
  });

  it('opens a snackbar with the error class on erro()', () => {
    const spy = vi.spyOn(snackBar, 'open');
    service.erro('Não foi possível salvar');
    expect(spy).toHaveBeenCalledWith(
      'Não foi possível salvar',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-erro'] }),
    );
  });
});
