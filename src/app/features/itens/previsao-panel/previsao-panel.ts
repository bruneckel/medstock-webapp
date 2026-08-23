import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChartConfiguration } from 'chart.js';
import { PrevisaoService } from '../../../core/services/previsao.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { extrairMensagemDeErro } from '../../../core/http/erro-api.util';
import { Previsao } from '../../../core/models';
import { ChartCanvas } from '../../../shared/components/chart-canvas/chart-canvas';

@Component({
  selector: 'app-previsao-panel',
  imports: [CommonModule, MatButtonModule, ChartCanvas],
  templateUrl: './previsao-panel.html',
  styleUrl: './previsao-panel.css',
})
export class PrevisaoPanel {
  private readonly previsaoService = inject(PrevisaoService);
  private readonly snackbar = inject(SnackbarService);

  readonly itemId = input.required<string>();
  readonly previsao = signal<Previsao | null>(null);
  readonly carregando = signal(true);
  readonly gerando = signal(false);

  readonly configuracaoGrafico = computed<ChartConfiguration | null>(() => {
    const atual = this.previsao();
    if (!atual) {
      return null;
    }
    return {
      type: 'line',
      data: {
        labels: [...atual.historico.map((p) => p.periodo), ...atual.previsao.map((p) => p.periodo)],
        datasets: [
          {
            label: 'Histórico',
            data: [...atual.historico.map((p) => p.valor), ...atual.previsao.map(() => null)],
            borderColor: '#185FA5',
          },
          {
            label: 'Previsão',
            data: [...atual.historico.map(() => null), ...atual.previsao.map((p) => p.valor)],
            borderColor: '#534AB7',
            borderDash: [6, 4],
          },
        ],
      },
      options: { plugins: { legend: { labels: { color: '#FFFFFF' } } } },
    };
  });

  constructor() {
    effect(() => {
      this.carregarPrevisao(this.itemId());
    });
  }

  gerar(): void {
    this.gerando.set(true);
    this.previsaoService.gerar(this.itemId()).subscribe({
      next: (previsao) => {
        this.gerando.set(false);
        this.previsao.set(previsao);
      },
      error: (erro: unknown) => {
        this.gerando.set(false);
        this.snackbar.erro(extrairMensagemDeErro(erro));
      },
    });
  }

  private carregarPrevisao(itemId: string): void {
    this.carregando.set(true);
    this.previsaoService.buscarPorItem(itemId).subscribe({
      next: (previsao) => {
        this.previsao.set(previsao);
        this.carregando.set(false);
      },
      error: () => {
        this.previsao.set(null);
        this.carregando.set(false);
      },
    });
  }
}
