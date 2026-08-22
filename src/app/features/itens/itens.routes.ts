import { Routes } from '@angular/router';

export const itensRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./lista/itens-lista').then((m) => m.ItensLista),
  },
];
