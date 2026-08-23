import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro').then((m) => m.Registro),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'admin/itens',
        loadChildren: () => import('./features/itens/itens.routes').then((m) => m.itensRoutes),
      },
      {
        path: 'admin/fornecedores',
        loadChildren: () => import('./features/fornecedores/fornecedores.routes').then((m) => m.fornecedoresRoutes),
      },
      {
        path: 'admin/pedidos',
        loadChildren: () => import('./features/pedidos/pedidos.routes').then((m) => m.pedidosRoutes),
      },
      {
        path: 'admin/alertas',
        loadChildren: () => import('./features/alertas/alertas.routes').then((m) => m.alertasRoutes),
      },
      {
        path: 'admin/usuarios',
        canMatch: [adminGuard],
        loadChildren: () => import('./features/usuarios/usuarios.routes').then((m) => m.usuariosRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
