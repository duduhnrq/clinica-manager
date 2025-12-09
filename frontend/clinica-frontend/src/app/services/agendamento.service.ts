import { Injectable } from '@angular/core';

export interface Agendamento {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipo: string;
  procedimento: string;
  data: string;
  horario: string;
  status?: 'agendada' | 'consultado' | 'realizada' | 'cancelada';

  // Campos da Operação
  anotacoesOperacao?: string;

  // Campos da Consulta
  tipoConsulta?: string;
  proximaConsulta?: string;
  queixasPrincipais?: string;
  exameFisico?: string;
  diagnostico?: string;
  tratamentoProposto?: string;
  recomendacoes?: string;
  observacoesGerais?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private chave = 'agendamentos_clinica';

  constructor() {}

  salvarAgendamentos(agendamentos: Agendamento[]): void {
    localStorage.setItem(this.chave, JSON.stringify(agendamentos));
  }

  carregarAgendamentos(): Agendamento[] {
    const dados = localStorage.getItem(this.chave);
    let agendamentos: Agendamento[] = dados ? JSON.parse(dados) : [];

    let dadosAntigosCorrigidos = false;

    agendamentos = agendamentos.map((ag) => {
      if (ag.anotacoesOperacao === undefined) {
        ag.anotacoesOperacao = '';
        dadosAntigosCorrigidos = true;
      }
      return ag;
    });

    if (dadosAntigosCorrigidos) {
      this.salvarAgendamentos(agendamentos);
    }

    return agendamentos;
  }

  adicionarAgendamento(agendamento: Agendamento): void {
    const agendamentos = this.carregarAgendamentos();
    agendamentos.push(agendamento);
    this.salvarAgendamentos(agendamentos);
  }

  atualizarAgendamento(id: number, agendamentoAtualizado: Agendamento): void {
    const agendamentos = this.carregarAgendamentos();
    const index = agendamentos.findIndex((ag) => ag.id === id);
    if (index !== -1) {
      agendamentos[index] = agendamentoAtualizado;
      this.salvarAgendamentos(agendamentos);
    }
  }

  deletarAgendamento(id: number): void {
    const agendamentos = this.carregarAgendamentos();
    const filtrados = agendamentos.filter((ag) => ag.id !== id);
    this.salvarAgendamentos(filtrados);
  }

  exportarJSON(): string {
    const agendamentos = this.carregarAgendamentos();
    return JSON.stringify(agendamentos, null, 2);
  }
}
