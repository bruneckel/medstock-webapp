import { Routes } from '@angular/router';

export const itensRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/itens-lista').then((m) => m.ItensLista),
  },
  {
    path: 'novo',
    loadComponent: () => import('./form/item-form').then((m) => m.ItemForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./form/item-form').then((m) => m.ItemForm),
  },
];
