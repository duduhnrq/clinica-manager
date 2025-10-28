import { Routes } from '@angular/router';
import { MenuPrincipal } from './pages/menu-principal/menu-principal';
import { Pacientes } from './pages/pacientes/pacientes';
import { NovaFicha } from './pages/pacientes/nova-ficha/nova-ficha';

export const routes: Routes = [
  { path: '', component: MenuPrincipal },
  { path: 'pacientes', component: Pacientes },
  { path: 'pacientes/nova-ficha', component: NovaFicha }
];
