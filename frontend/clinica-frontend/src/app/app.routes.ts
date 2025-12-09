import { Routes } from '@angular/router';
import { MenuPrincipal } from './pages/menu-principal/menu-principal';
import { Pacientes } from './pages/pacientes/pacientes';
import { NovaFicha } from './pages/pacientes/nova-ficha/nova-ficha';
import { VerDetalhes } from './pages/pacientes/ver-detalhes/ver-detalhes';
import { EditarPaciente } from './pages/pacientes/ver-detalhes/editar-paciente/editar-paciente';
import { Agenda } from './pages/agenda/agenda';
import { Consultas } from './pages/consultas/consultas'
import { Consultar } from './pages/consultas/consultar/consultar';
import { Operacoes } from './pages/operacoes/operacoes';
import { Anotacoes } from './pages/operacoes/anotacoes/anotacoes';

export const routes: Routes = [
  { path: '', component: MenuPrincipal },
  { path: 'pacientes', component: Pacientes },
  { path: 'pacientes/nova-ficha', component: NovaFicha },
  { path: 'pacientes/ver-detalhes/:id', component: VerDetalhes },
  { path: 'pacientes/ver-detalhes/editar-paciente/:id', component: EditarPaciente },
  { path: 'agenda', component: Agenda },
  { path: 'consultas', component: Consultas },
  { path: 'consultas/consultar/:id', component: Consultar },
  { path: 'operacoes', component: Operacoes },
  { path: 'operacoes/anotacoes/:id', component: Anotacoes },
];