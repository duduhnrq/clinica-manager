import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';

interface ItemOperacao {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  data: string;
  horario: string;
  tipo: string;
  status: string;
}

@Component({
  selector: 'app-operacoes',
  imports: [RouterLink, CommonModule],
  templateUrl: './operacoes.html',
})
export class Operacoes implements OnInit {
  operacoesAgendadas: ItemOperacao[] = [];
  carregando = true;
  nenhumRegistro = false;

  totalAguardando = 0;
  totalRealizada = 0;

  constructor(
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.carregarOperacoes();
  }

  private carregarOperacoes() {
    this.carregando = true;
    const agendamentos = this.agendamentoService.carregarAgendamentos() || [];

    const operacoes: ItemOperacao[] = [];
    let totalAguardando = 0;
    let totalRealizada = 0;

    agendamentos.forEach((ag: any) => {
      if (!ag || !ag.data) return;

      if (!ag.tipo || String(ag.tipo).toLowerCase() !== 'operacao') return;

      const status = ag.status || 'agendada';

      operacoes.push({
        id: ag.id,
        pacienteId: ag.pacienteId,
        pacienteNome: ag.pacienteNome || '—',
        data: ag.data,
        horario: ag.horario,
        tipo: ag.tipo,
        status: status,
      });

      if (status === 'realizada') totalRealizada++;
      else totalAguardando++;
    });

    // Buscar nomes dos pacientes
    const s: any = this.pacienteService as any;
    const pacientesPromise =
      s.listar && typeof s.listar === 'function'
        ? s
            .listar()
            .toPromise()
            .catch(() => [])
        : Promise.resolve([]);

    pacientesPromise
      .then((lista: any[]) => {
        const pacientesMap = new Map<number, any>();
        (lista || []).forEach((p: any) => pacientesMap.set(Number(p.id), p));

        operacoes.forEach((op) => {
          const p = pacientesMap.get(op.pacienteId);
          if (p?.nomeCompleto) op.pacienteNome = p.nomeCompleto;
        });

        // Ordena pela data, mas sem filtrar nada
        operacoes.sort((a, b) => a.data.localeCompare(b.data));

        this.operacoesAgendadas = operacoes;
        this.totalAguardando = totalAguardando;
        this.totalRealizada = totalRealizada;
        this.nenhumRegistro = operacoes.length === 0;
        this.carregando = false;
      })
      .catch(() => {
        operacoes.sort((a, b) => a.data.localeCompare(b.data));

        this.operacoesAgendadas = operacoes;
        this.totalAguardando = totalAguardando;
        this.totalRealizada = totalRealizada;
        this.nenhumRegistro = operacoes.length === 0;
        this.carregando = false;
      });
  }

  marcarComoRealizada(id: number) {
    const agendamentos = this.agendamentoService.carregarAgendamentos();
    const index = agendamentos.findIndex((ag) => ag.id === id);

    if (index !== -1) {
      agendamentos[index].status = 'realizada';
      this.agendamentoService.salvarAgendamentos(agendamentos);
      this.carregarOperacoes();
    }
  }

  get totalOperacoes(): number {
    return this.operacoesAgendadas.length;
  }

  get totalRealizadas(): number {
    return this.operacoesAgendadas.filter((op) => op.status === 'realizada').length;
  }

  get totalAgendadas(): number {
    return this.operacoesAgendadas.filter((op) => op.status === 'agendada').length;
  }
}
