import { Routes } from '@angular/router';

export const fornecedoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/fornecedores-lista').then((m) => m.FornecedoresLista),
  },
];
