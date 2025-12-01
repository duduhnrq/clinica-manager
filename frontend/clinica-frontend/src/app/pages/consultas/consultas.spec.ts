import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consultas } from './consultas';

describe('Consultas', () => {
  let component: Consultas;
  let fixture: ComponentFixture<Consultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consultas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
