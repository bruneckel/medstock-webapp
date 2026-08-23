import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PrevisaoPanel } from './previsao-panel';
import { PrevisaoService } from '../../../core/services/previsao.service';
import { Previsao } from '../../../core/models';

describe('PrevisaoPanel', () => {
  const previsaoFalsa: Previsao = {
    id: 'p1',
    itemId: 'i1',
    geradoEm: '2026-08-22T00:00:00Z',
    historico: [{ periodo: '2026-06', valor: 100 }],
    previsao: [{ periodo: '2026-09', valor: 120 }],
    recomendacao: 'Aumentar pedido em 20%',
    fatoresConsiderados: ['Sazonalidade'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrevisaoPanel],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('loads the existing previsão for the given item on init', () => {
    const previsaoService = TestBed.inject(PrevisaoService);
    vi.spyOn(previsaoService, 'buscarPorItem').mockReturnValue(of(previsaoFalsa));

    const fixture = TestBed.createComponent(PrevisaoPanel);
    fixture.componentRef.setInput('itemId', 'i1');
    fixture.detectChanges();

    expect(fixture.componentInstance.previsao()).toEqual(previsaoFalsa);
  });

  it('shows no previsão without treating a 404 as an error state', () => {
    const previsaoService = TestBed.inject(PrevisaoService);
    vi.spyOn(previsaoService, 'buscarPorItem').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    const fixture = TestBed.createComponent(PrevisaoPanel);
    fixture.componentRef.setInput('itemId', 'i1');
    fixture.detectChanges();

    expect(fixture.componentInstance.previsao()).toBeNull();
    expect(fixture.componentInstance.carregando()).toBe(false);
  });

  it('replaces the previsão signal after gerar()', () => {
    const previsaoService = TestBed.inject(PrevisaoService);
    vi.spyOn(previsaoService, 'buscarPorItem').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    vi.spyOn(previsaoService, 'gerar').mockReturnValue(of(previsaoFalsa));

    const fixture = TestBed.createComponent(PrevisaoPanel);
    fixture.componentRef.setInput('itemId', 'i1');
    fixture.detectChanges();
    fixture.componentInstance.gerar();

    expect(fixture.componentInstance.previsao()).toEqual(previsaoFalsa);
  });
});
