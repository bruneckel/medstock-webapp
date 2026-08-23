import { Routes } from '@angular/router';

export const alertasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/alertas-lista').then((m) => m.AlertasLista),
  },
];
