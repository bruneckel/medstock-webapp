import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  input,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-canvas',
  template: `<canvas #canvas></canvas>`,
})
export class ChartCanvas implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  readonly config = input.required<ChartConfiguration>();

  private instancia: Chart | null = null;

  ngAfterViewInit(): void {
    this.instancia = new Chart(this.canvasRef.nativeElement, this.config());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange && this.canvasRef) {
      this.instancia?.destroy();
      this.instancia = new Chart(this.canvasRef.nativeElement, this.config());
    }
  }

  ngOnDestroy(): void {
    this.instancia?.destroy();
  }
}
