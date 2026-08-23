import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AlertasLista } from './alertas-lista';
import { AlertaService } from '../../../core/services/alerta.service';
import { Alerta } from '../../../core/models';

describe('AlertasLista', () => {
  const alertaFalso: Alerta = {
    id: '1',
    tipo: 'ESTOQUE_CRITICO',
    severidade: 'CRITICO',
    titulo: 'Estoque crítico: Soro fisiológico',
    mensagem: 'Quantidade abaixo de 30% do mínimo',
    itemId: 'i1',
    pedidoId: null,
    status: 'ATIVO',
    acaoTomada: null,
    criadoEm: '2026-08-22T00:00:00Z',
    resolvidoEm: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertasLista],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
      ],
    });
  });

  it('loads alertas on init', () => {
    const alertaService = TestBed.inject(AlertaService);
    vi.spyOn(alertaService, 'listar').mockReturnValue(of([alertaFalso]));

    const fixture = TestBed.createComponent(AlertasLista);
    fixture.detectChanges();

    expect(fixture.componentInstance.alertas()).toEqual([alertaFalso]);
  });

  it('runs the automatic scan and reloads the list', () => {
    const alertaService = TestBed.inject(AlertaService);
    vi.spyOn(alertaService, 'listar').mockReturnValue(of([alertaFalso]));
    const gerarSpy = vi.spyOn(alertaService, 'gerar').mockReturnValue(of([alertaFalso]));

    const fixture = TestBed.createComponent(AlertasLista);
    fixture.detectChanges();
    fixture.componentInstance.gerar();

    expect(gerarSpy).toHaveBeenCalled();
    expect(fixture.componentInstance.gerando()).toBe(false);
  });

  it('removes an alerta after confirming', () => {
    const alertaService = TestBed.inject(AlertaService);
    vi.spyOn(alertaService, 'listar').mockReturnValue(of([alertaFalso]));
    const removerSpy = vi.spyOn(alertaService, 'remover').mockReturnValue(of(undefined));

    const dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of(true) } as never);

    const fixture = TestBed.createComponent(AlertasLista);
    fixture.detectChanges();
    fixture.componentInstance.remover(alertaFalso);

    expect(removerSpy).toHaveBeenCalledWith('1');
  });
});
