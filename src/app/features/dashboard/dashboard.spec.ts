import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Dashboard } from './dashboard';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResumo } from '../../core/models';

describe('Dashboard', () => {
  const resumoFalso: DashboardResumo = {
    geradoEm: '2026-08-22T12:00:00Z',
    estoque: { total: 42, criticos: 3, atencao: 7, normais: 32, vencendo: 2 },
    pedidosDoDia: [],
    alertasRecentes: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('loads the summary on init and exposes it as a signal', () => {
    const dashboardService = TestBed.inject(DashboardService);
    vi.spyOn(dashboardService, 'resumo').mockReturnValue(of(resumoFalso));

    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();

    expect(fixture.componentInstance.resumo()).toEqual(resumoFalso);
    expect(fixture.componentInstance.carregando()).toBe(false);
  });
});
