import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeTransitionService } from '@brustack/angular-theme-transitions';
import { AuthService } from '../../core/auth/auth.service';
import { PerfilUsuario } from '../../core/models';

interface ItemDeNavegacao {
  rota: string;
  rotulo: string;
  icone: string;
  perfisPermitidos?: PerfilUsuario[];
}

const ITENS_DE_NAVEGACAO: ItemDeNavegacao[] = [
  { rota: '/home', rotulo: 'Início', icone: 'dashboard' },
  { rota: '/admin/itens', rotulo: 'Itens', icone: 'inventory_2' },
  { rota: '/admin/pedidos', rotulo: 'Pedidos', icone: 'local_shipping' },
  { rota: '/admin/fornecedores', rotulo: 'Fornecedores', icone: 'store' },
  { rota: '/admin/alertas', rotulo: 'Alertas', icone: 'warning' },
  { rota: '/admin/usuarios', rotulo: 'Usuários', icone: 'group', perfisPermitidos: ['ADMIN'] },
];

@Component({
  selector: 'app-shell',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeTransitionService);

  readonly usuario = this.authService.usuario;
  readonly itensDeNavegacao = ITENS_DE_NAVEGACAO;

  podeVer(item: ItemDeNavegacao): boolean {
    if (!item.perfisPermitidos) {
      return true;
    }
    const perfil = this.authService.perfil();
    return perfil !== null && item.perfisPermitidos.includes(perfil);
  }

  sair(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
