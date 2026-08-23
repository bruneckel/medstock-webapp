import { Routes } from '@angular/router';

export const fornecedoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/fornecedores-lista').then((m) => m.FornecedoresLista),
  },
  {
    path: 'novo',
    loadComponent: () => import('./form/fornecedor-form').then((m) => m.FornecedorForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./form/fornecedor-form').then((m) => m.FornecedorForm),
  },
];
