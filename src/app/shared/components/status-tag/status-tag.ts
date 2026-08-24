import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type StatusConhecido =
  | 'CRITICO'
  | 'ATENCAO'
  | 'NORMAL'
  | 'ATIVO'
  | 'INATIVO'
  | 'RESOLVIDO'
  | 'IGNORADO'
  | 'PENDENTE'
  | 'EM_ROTA'
  | 'ATRASADO'
  | 'ENTREGUE'
  | 'NAO_ENTREGUE'
  | 'EXTRAVIO_REEMBOLSO'
  | 'CANCELADO'
  | 'INFO';

const TOM_POR_STATUS: Record<StatusConhecido, 'danger' | 'warning' | 'success' | 'info'> = {
  CRITICO: 'danger',
  ATRASADO: 'danger',
  NAO_ENTREGUE: 'danger',
  EXTRAVIO_REEMBOLSO: 'danger',
  CANCELADO: 'danger',
  INATIVO: 'danger',
  ATENCAO: 'warning',
  PENDENTE: 'warning',
  IGNORADO: 'warning',
  NORMAL: 'success',
  ATIVO: 'success',
  RESOLVIDO: 'success',
  ENTREGUE: 'success',
  EM_ROTA: 'info',
  INFO: 'info',
};

const ROTULO_POR_STATUS: Record<StatusConhecido, string> = {
  CRITICO: 'Crítico',
  ATENCAO: 'Atenção',
  NORMAL: 'Normal',
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  RESOLVIDO: 'Resolvido',
  IGNORADO: 'Ignorado',
  PENDENTE: 'Pendente',
  EM_ROTA: 'Em rota',
  ATRASADO: 'Atrasado',
  ENTREGUE: 'Entregue',
  NAO_ENTREGUE: 'Não entregue',
  EXTRAVIO_REEMBOLSO: 'Extravio/Reembolso',
  CANCELADO: 'Cancelado',
  INFO: 'Info',
};

const ICONE_POR_TOM: Record<'danger' | 'warning' | 'success' | 'info', string> = {
  danger: 'error',
  warning: 'warning',
  success: 'check_circle',
  info: 'info',
};

@Component({
  selector: 'app-status-tag',
  imports: [MatIconModule],
  template: `
    <span class="status-tag" [class]="'status-tag--' + tom()">
      <mat-icon class="status-tag-icone">{{ icone() }}</mat-icon>
      {{ rotulo() }}
    </span>
  `,
  styleUrl: './status-tag.css',
})
export class StatusTag {
  readonly status = input.required<StatusConhecido>();

  readonly tom = computed(() => TOM_POR_STATUS[this.status()]);
  readonly rotulo = computed(() => ROTULO_POR_STATUS[this.status()]);
  readonly icone = computed(() => ICONE_POR_TOM[this.tom()]);
}
