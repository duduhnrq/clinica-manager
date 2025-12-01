// ...existing code...
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';

interface ItemConsulta {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  data: string;
  horario: string;
  tipo: string;
  status: string;
}

@Component({
  selector: 'app-consultas',
  imports: [RouterLink, CommonModule],
  templateUrl: './consultas.html',
})
export class Consultas implements OnInit {
  consultasAgendadas: ItemConsulta[] = [];
  carregando = true;
  nenhumRegistro = false;
  totalAguardando = 0;
  totalConsultado = 0;

  constructor(
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.carregarHistoricoConsultas();
  }

  private carregarHistoricoConsultas() {
    this.carregando = true;
    const agendamentos = this.agendamentoService.carregarAgendamentos() || [];

    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, hoje.getDate());
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 2, hoje.getDate());
    
    const consultas: ItemConsulta[] = [];
    let totalAguardando = 0;
    let totalConsultado = 0;

    agendamentos.forEach((ag: any) => {
      if (!ag || !ag.data) return;

      const parts = String(ag.data).split('-').map(Number);
      if (parts.length < 3) return;
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);

      if (ag.tipo && String(ag.tipo).toLowerCase() !== 'consulta') return;

      if (dt >= inicio && dt <= fim) {
        const status = ag.status || 'agendada';
        consultas.push({
          id: ag.id,
          pacienteId: ag.pacienteId,
          pacienteNome: ag.pacienteNome || '—',
          data: ag.data,
          horario: ag.horario,
          tipo: ag.tipo,
          status: status,
        });

        // Contar status
        if (status === 'consultado') {
          totalConsultado++;
        } else if (status === 'agendada') {
          totalAguardando++;
        }
      }
    });

    const s: any = this.pacienteService as any;
    const pacientesPromise = (s.listar && typeof s.listar === 'function')
      ? s.listar().toPromise().catch(() => [])
      : Promise.resolve([]);

    pacientesPromise.then((lista: any[]) => {
      const pacientesMap = new Map<number, any>();
      (lista || []).forEach((p: any) => pacientesMap.set(Number(p.id), p));

      consultas.forEach((consulta) => {
        const p = pacientesMap.get(consulta.pacienteId);
        if (p && p.nomeCompleto) {
          consulta.pacienteNome = p.nomeCompleto;
        }
      });

      consultas.sort((a, b) => a.data.localeCompare(b.data));

      this.consultasAgendadas = consultas;
      this.totalAguardando = totalAguardando;
      this.totalConsultado = totalConsultado;
      this.nenhumRegistro = consultas.length === 0;
      this.carregando = false;
    }).catch(() => {
      consultas.sort((a, b) => a.data.localeCompare(b.data));
      this.consultasAgendadas = consultas;
      this.totalAguardando = totalAguardando;
      this.totalConsultado = totalConsultado;
      this.nenhumRegistro = consultas.length === 0;
      this.carregando = false;
    });
  }

  marcarComoConsultado(id: number) {
    const agendamentos = this.agendamentoService.carregarAgendamentos();
    const index = agendamentos.findIndex(ag => ag.id === id);
    if (index !== -1) {
      agendamentos[index].status = 'consultado';
      this.agendamentoService.salvarAgendamentos(agendamentos);
      this.carregarHistoricoConsultas();
    }
  }
}