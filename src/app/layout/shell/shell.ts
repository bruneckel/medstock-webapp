import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeTransitionService } from '@brustack/angular-theme-transitions';
import { AuthService } from '../../core/auth/auth.service';
import { PerfilUsuario } from '../../core/models';

const CHAVE_SIDENAV_COLAPSADO = 'medstock.sidenav-colapsado';

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
    RouterLinkActive,
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
  private readonly breakpointObserver = inject(BreakpointObserver);
  protected readonly theme = inject(ThemeTransitionService);

  readonly usuario = this.authService.usuario;
  readonly itensDeNavegacao = ITENS_DE_NAVEGACAO;

  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((estado) => estado.matches)),
    { initialValue: false },
  );

  readonly colapsado = signal(localStorage.getItem(CHAVE_SIDENAV_COLAPSADO) === 'true');
  readonly menuMobileAberto = signal(false);

  podeVer(item: ItemDeNavegacao): boolean {
    if (!item.perfisPermitidos) {
      return true;
    }
    const perfil = this.authService.perfil();
    return perfil !== null && item.perfisPermitidos.includes(perfil);
  }

  alternarColapso(): void {
    this.colapsado.update((atual) => {
      const novo = !atual;
      localStorage.setItem(CHAVE_SIDENAV_COLAPSADO, String(novo));
      return novo;
    });
  }

  alternarMenuMobile(): void {
    this.menuMobileAberto.update((atual) => !atual);
  }

  fecharMenuMobile(): void {
    this.menuMobileAberto.set(false);
  }

  sair(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
