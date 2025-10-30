import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalhes } from './ver-detalhes';

describe('VerDetalhes', () => {
  let component: VerDetalhes;
  let fixture: ComponentFixture<VerDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
