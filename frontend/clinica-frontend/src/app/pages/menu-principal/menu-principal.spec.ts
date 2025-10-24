import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPrincipal } from './menu-principal';

describe('MenuPrincipal', () => {
  let component: MenuPrincipal;
  let fixture: ComponentFixture<MenuPrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
