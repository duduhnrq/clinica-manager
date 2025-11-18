import { Routes } from '@angular/router';
import { MenuPrincipal } from './pages/menu-principal/menu-principal';
import { Pacientes } from './pages/pacientes/pacientes';
import { NovaFicha } from './pages/pacientes/nova-ficha/nova-ficha';
import { VerDetalhes } from './pages/pacientes/ver-detalhes/ver-detalhes';
import { EditarPaciente } from './pages/pacientes/ver-detalhes/editar-paciente/editar-paciente';

export const routes: Routes = [
  { path: '', component: MenuPrincipal },
  { path: 'pacientes', component: Pacientes },
  { path: 'pacientes/nova-ficha', component: NovaFicha },
  { path: 'pacientes/ver-detalhes/:id', component: VerDetalhes },
  { path: 'pacientes/ver-detalhes/editar-paciente/:id', component: EditarPaciente },
];
