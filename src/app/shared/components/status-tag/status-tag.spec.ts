import { TestBed } from '@angular/core/testing';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  it('maps CRITICO to the danger tone and a Portuguese label', () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('status', 'CRITICO');
    fixture.detectChanges();

    expect(fixture.componentInstance.tom()).toBe('danger');
    expect(fixture.componentInstance.rotulo()).toBe('Crítico');
  });

  it('maps ENTREGUE to the success tone', () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('status', 'ENTREGUE');
    fixture.detectChanges();

    expect(fixture.componentInstance.tom()).toBe('success');
  });

  it('renders the label text in the DOM', () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('status', 'PENDENTE');
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.textContent).toContain('Pendente');
  });
});
