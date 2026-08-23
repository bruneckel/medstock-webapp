import { Routes } from '@angular/router';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./form/usuario-form').then((m) => m.UsuarioForm),
  },
];
