import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pacientes } from './pacientes';

describe('Pacientes', () => {
  let component: Pacientes;
  let fixture: ComponentFixture<Pacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pacientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
