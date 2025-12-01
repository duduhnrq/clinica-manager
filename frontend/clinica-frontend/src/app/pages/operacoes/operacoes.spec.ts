import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Operacoes } from './operacoes';

describe('Operacoes', () => {
  let component: Operacoes;
  let fixture: ComponentFixture<Operacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Operacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Operacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
