import { Routes } from '@angular/router';

export const pedidosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/pedidos-lista').then((m) => m.PedidosLista),
  },
  {
    path: 'novo',
    loadComponent: () => import('./form/pedido-form').then((m) => m.PedidoForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./detalhe/pedido-detalhe').then((m) => m.PedidoDetalhe),
  },
];
