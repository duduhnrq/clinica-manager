import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consultar } from './consultar';

describe('Consultar', () => {
  let component: Consultar;
  let fixture: ComponentFixture<Consultar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consultar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consultar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
