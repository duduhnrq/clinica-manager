import { Routes } from '@angular/router';
import { MenuPrincipal } from './pages/menu-principal/menu-principal';
import { Pacientes } from './pages/pacientes/pacientes';

export const routes: Routes = [
  { path: '', component: MenuPrincipal },
  { path: 'pacientes', component: Pacientes }
];
