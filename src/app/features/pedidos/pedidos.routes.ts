import { Routes } from '@angular/router';

export const pedidosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/pedidos-lista').then((m) => m.PedidosLista),
  },
];
