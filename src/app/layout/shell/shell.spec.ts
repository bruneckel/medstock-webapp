import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { ThemeTransitionService } from '@brustack/angular-theme-transitions';
import { Shell } from './shell';
import { AuthService } from '../../core/auth/auth.service';

describe('Shell', () => {
  let authService: AuthService;
  let router: Router;
  let theme: ThemeTransitionService;
  let breakpointObserver: {
    observe: (queries: string[]) => Observable<{ matches: boolean; breakpoints: Record<string, boolean> }>;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        {
          provide: BreakpointObserver,
          useValue: { observe: () => of({ matches: false, breakpoints: {} }) },
        },
      ],
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    theme = TestBed.inject(ThemeTransitionService);
    breakpointObserver = TestBed.inject(BreakpointObserver) as never;
  });

  it('hides the Usuários nav item for a non-ADMIN profile', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'FARMACEUTICO' });
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    const itemUsuarios = componente.itensDeNavegacao.find((i) => i.rota === '/admin/usuarios')!;
    expect(componente.podeVer(itemUsuarios)).toBe(false);
  });

  it('shows the Usuários nav item for ADMIN', () => {
    Object.defineProperty(authService, 'perfil', { value: () => 'ADMIN' });
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    const itemUsuarios = componente.itensDeNavegacao.find((i) => i.rota === '/admin/usuarios')!;
    expect(componente.podeVer(itemUsuarios)).toBe(true);
  });

  it('logs out and redirects to /login on sair()', () => {
    const logoutSpy = vi.spyOn(authService, 'logout');
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(Shell);

    fixture.componentInstance.sair();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('toggles the theme when the theme button is clicked', () => {
    const toggleSpy = vi.spyOn(theme, 'toggleTheme').mockResolvedValue();
    const fixture = TestBed.createComponent(Shell);
    fixture.detectChanges();

    const botaoTema = fixture.nativeElement.querySelector('button[aria-label*="tema"]') as HTMLButtonElement;
    botaoTema.click();

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('starts expanded and not collapsed when localStorage has no saved preference', () => {
    const fixture = TestBed.createComponent(Shell);
    expect(fixture.componentInstance.colapsado()).toBe(false);
  });

  it('starts collapsed when localStorage has a saved preference', () => {
    localStorage.setItem('medstock.sidenav-colapsado', 'true');
    const fixture = TestBed.createComponent(Shell);
    expect(fixture.componentInstance.colapsado()).toBe(true);
  });

  it('toggles and persists the collapsed state', () => {
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    componente.alternarColapso();

    expect(componente.colapsado()).toBe(true);
    expect(localStorage.getItem('medstock.sidenav-colapsado')).toBe('true');

    componente.alternarColapso();

    expect(componente.colapsado()).toBe(false);
    expect(localStorage.getItem('medstock.sidenav-colapsado')).toBe('false');
  });

  it('reads isMobile as false when the breakpoint observer reports no match', () => {
    const fixture = TestBed.createComponent(Shell);
    expect(fixture.componentInstance.isMobile()).toBe(false);
  });

  it('reads isMobile as true when the breakpoint observer reports a match', () => {
    vi.spyOn(breakpointObserver, 'observe').mockReturnValue(of({ matches: true, breakpoints: {} }));
    const fixture = TestBed.createComponent(Shell);
    expect(fixture.componentInstance.isMobile()).toBe(true);
  });

  it('toggles the mobile menu open state', () => {
    const fixture = TestBed.createComponent(Shell);
    const componente = fixture.componentInstance;

    expect(componente.menuMobileAberto()).toBe(false);
    componente.alternarMenuMobile();
    expect(componente.menuMobileAberto()).toBe(true);
    componente.fecharMenuMobile();
    expect(componente.menuMobileAberto()).toBe(false);
  });
});
