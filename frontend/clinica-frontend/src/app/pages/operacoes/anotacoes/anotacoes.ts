import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoService, Agendamento } from '../../../services/agendamento.service'; 
import { PacienteService } from '../../../services/paciente.service'; 


@Component({
 selector: 'app-anotacoes',
 standalone: true, 
 imports: [RouterLink, CommonModule, FormsModule],
 templateUrl: './anotacoes.html',
 styleUrl: './anotacoes.css',
})
export class Anotacoes implements OnInit {
 operacao: Agendamento | null = null; 
 pacienteDetalhes: any = null;
 carregando = true;

 anotacoesOperacao = '';

 modalSucessoAberto = false;

 constructor(
  private route: ActivatedRoute,
  private router: Router,
  private agendamentoService: AgendamentoService, 
  private pacienteService: PacienteService
 ) {}

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
   this.carregarOperacao(Number(id));
  }
 }

 carregarOperacao(id: number) {
  const agendamentos = this.agendamentoService.carregarAgendamentos();
  const op = agendamentos.find((a) => a.id === id); 

  if (op) {
   this.operacao = op;
   this.anotacoesOperacao = this.operacao.anotacoesOperacao || '';
   this.carregarPaciente(op.pacienteId);
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
 
 fecharModalSucesso() {
  this.modalSucessoAberto = false;
  this.router.navigate(['/operacoes']); 
 }

 salvarAnotacoes() {
  if (!this.operacao) return;

  this.operacao.anotacoesOperacao = this.anotacoesOperacao;
  this.operacao.status = 'realizada'; 
  
  this.agendamentoService.atualizarAgendamento(this.operacao.id, this.operacao); 
  
  this.modalSucessoAberto = true;
 }
}