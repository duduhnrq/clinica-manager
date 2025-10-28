import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaFicha } from './nova-ficha';

describe('NovaFicha', () => {
  let component: NovaFicha;
  let fixture: ComponentFixture<NovaFicha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaFicha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaFicha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
