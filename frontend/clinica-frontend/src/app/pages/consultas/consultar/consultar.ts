import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoService } from '../../../services/agendamento.service';
import { Agendamento } from '../../../services/agendamento.service';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-consultar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './consultar.html',
  styleUrl: './consultar.css',
})
export class Consultar implements OnInit {
  agendamento: any = null;
  pacienteDetalhes: any = null;
  carregando = true;

  // Dados do formulário
  tipoConsulta = '';
  proximaConsulta = '';
  queixasPrincipais = '';
  exameFisico = '';
  diagnostico = '';
  tratamentoProposto = '';
  recomendacoes = '';
  observacoesGerais = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarAgendamento(Number(id));
    }
  }

  carregarAgendamento(id: number) {
    const agendamentos = this.agendamentoService.carregarAgendamentos();
    const ag = agendamentos.find((a) => a.id === id);

    if (ag) {
      this.agendamento = ag;
      // Carrega dados salvos anteriormente se existirem
      this.tipoConsulta = ag.tipoConsulta || '';
      this.proximaConsulta = ag.proximaConsulta || '';
      this.queixasPrincipais = ag.queixasPrincipais || '';
      this.exameFisico = ag.exameFisico || '';
      this.diagnostico = ag.diagnostico || '';
      this.tratamentoProposto = ag.tratamentoProposto || '';
      this.recomendacoes = ag.recomendacoes || '';
      this.observacoesGerais = ag.observacoesGerais || '';

      this.carregarPaciente(ag.pacienteId);
    } else {
      this.carregando = false;
    }
  }

  carregarPaciente(pacienteId: number) {
    const s: any = this.pacienteService as any;
    if (s.listar && typeof s.listar === 'function') {
      s.listar().subscribe((lista: any[]) => {
        const paciente = lista.find((p) => p.id === pacienteId);
        if (paciente) {
          this.pacienteDetalhes = paciente;
        }
        this.carregando = false;
      });
    } else {
      this.carregando = false;
    }
  }

  salvarConsulta() {
    if (!this.agendamento) return;

    // Atualizar agendamento atual com dados da consulta
    this.agendamento.tipoConsulta = this.tipoConsulta;
    this.agendamento.proximaConsulta = this.proximaConsulta;
    this.agendamento.queixasPrincipais = this.queixasPrincipais;
    this.agendamento.exameFisico = this.exameFisico;
    this.agendamento.diagnostico = this.diagnostico;
    this.agendamento.tratamentoProposto = this.tratamentoProposto;
    this.agendamento.recomendacoes = this.recomendacoes;
    this.agendamento.observacoesGerais = this.observacoesGerais;
    this.agendamento.status = 'consultado';

    const agendamentos = this.agendamentoService.carregarAgendamentos();
    const index = agendamentos.findIndex((a) => a.id === this.agendamento.id);
    if (index !== -1) {
      agendamentos[index] = this.agendamento;

      // Se houver próxima consulta, criar novo agendamento
      if (this.proximaConsulta && this.proximaConsulta.trim() !== '') {
        const novoAgendamento: Agendamento = {
          id: Date.now(),
          pacienteId: this.agendamento.pacienteId,
          pacienteNome: this.agendamento.pacienteNome,
          tipo: 'consulta',
          procedimento: 'Retorno - ' + this.agendamento.pacienteNome,
          data: this.proximaConsulta,
          horario: this.agendamento.horario || '--:--',
          status: 'agendada',
        };
        agendamentos.push(novoAgendamento);
      }

      this.agendamentoService.salvarAgendamentos(agendamentos);
      alert('Consulta salva com sucesso!');
      // Redireciona para a página de consultas após salvar
      this.router.navigate(['/consultas']);
    }
  }
}
