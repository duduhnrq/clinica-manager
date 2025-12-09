import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anotacoes } from './anotacoes';

describe('Anotacoes', () => {
  let component: Anotacoes;
  let fixture: ComponentFixture<Anotacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Anotacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anotacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
