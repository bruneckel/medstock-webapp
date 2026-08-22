import { TestBed } from '@angular/core/testing';
import { ChartConfiguration } from 'chart.js';
import { ChartCanvas } from './chart-canvas';

describe('ChartCanvas', () => {
  const configuracaoInicial: ChartConfiguration = {
    type: 'doughnut',
    data: { labels: ['Crítico'], datasets: [{ data: [1] }] },
  };

  it('creates a canvas element and renders a chart instance', () => {
    const fixture = TestBed.createComponent(ChartCanvas);
    fixture.componentRef.setInput('config', configuracaoInicial);
    fixture.detectChanges();

    const canvas = (fixture.nativeElement as HTMLElement).querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('recreates the chart when the config input changes', () => {
    const fixture = TestBed.createComponent(ChartCanvas);
    fixture.componentRef.setInput('config', configuracaoInicial);
    fixture.detectChanges();

    fixture.componentRef.setInput('config', {
      ...configuracaoInicial,
      data: { labels: ['Atenção'], datasets: [{ data: [5] }] },
    });
    fixture.detectChanges();

    const canvas = (fixture.nativeElement as HTMLElement).querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
