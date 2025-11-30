import { Injectable } from '@angular/core';

interface Agendamento {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipo: string;
  procedimento: string;
  data: string;
  horario: string;
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
    return dados ? JSON.parse(dados) : [];
  }

  adicionarAgendamento(agendamento: Agendamento): void {
    const agendamentos = this.carregarAgendamentos();
    agendamentos.push(agendamento);
    this.salvarAgendamentos(agendamentos);
  }

  atualizarAgendamento(id: number, agendamentoAtualizado: Agendamento): void {
    const agendamentos = this.carregarAgendamentos();
    const index = agendamentos.findIndex(ag => ag.id === id);
    if (index !== -1) {
      agendamentos[index] = agendamentoAtualizado;
      this.salvarAgendamentos(agendamentos);
    }
  }

  deletarAgendamento(id: number): void {
    const agendamentos = this.carregarAgendamentos();
    const filtrados = agendamentos.filter(ag => ag.id !== id);
    this.salvarAgendamentos(filtrados);
  }

  exportarJSON(): string {
    const agendamentos = this.carregarAgendamentos();
    return JSON.stringify(agendamentos, null, 2);
  }
}