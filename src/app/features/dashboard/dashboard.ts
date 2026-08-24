import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResumo } from '../../core/models';
import { ICONE_POR_TOM, StatusConhecido, StatusTag, TOM_POR_STATUS } from '../../shared/components/status-tag/status-tag';
import { ChartCanvas } from '../../shared/components/chart-canvas/chart-canvas';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, StatusTag, ChartCanvas],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  readonly resumo = signal<DashboardResumo | null>(null);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  readonly configuracaoGrafico = computed<ChartConfiguration | null>(() => {
    const atual = this.resumo();
    if (!atual) {
      return null;
    }
    return {
      type: 'doughnut',
      data: {
        labels: ['Crítico', 'Atenção', 'Normal'],
        datasets: [
          {
            data: [atual.estoque.criticos, atual.estoque.atencao, atual.estoque.normais],
            backgroundColor: ['#E24B4A', '#EF9F27', '#3B6D11'],
          },
        ],
      },
      options: { plugins: { legend: { labels: { color: '#FFFFFF' } } } },
    };
  });

  tomDoStatus(status: StatusConhecido): 'danger' | 'warning' | 'success' | 'info' {
    return TOM_POR_STATUS[status];
  }

  iconeDoStatus(status: StatusConhecido): string {
    return ICONE_POR_TOM[this.tomDoStatus(status)];
  }

  constructor() {
    this.dashboardService.resumo().subscribe({
      next: (resumo) => {
        this.resumo.set(resumo);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar o resumo do dia.');
        this.carregando.set(false);
      },
    });
  }
}
