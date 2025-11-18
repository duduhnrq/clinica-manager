import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPaciente } from './editar-paciente';

describe('EditarPaciente', () => {
  let component: EditarPaciente;
  let fixture: ComponentFixture<EditarPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
