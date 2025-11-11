import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../../services/paciente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.css'],
})
export class Pacientes implements OnInit {
  private pacienteService = inject(PacienteService);
  pacientes: Paciente[] = [];
  pacientesBusca: Paciente[] = [];
  termoBusca = '';

  ngOnInit(): void {
    this.pacienteService.listar().subscribe({
      next: (dados) => {
        this.pacientes = dados || [];
        this.pacientesBusca = [...this.pacientes];
      },
      error: (erro) => {
        console.error('Erro ao carregar pacientes:', erro);
      },
    });
  }

  buscarPacientes() {
    const termo = (this.termoBusca || '').trim().toLowerCase();

    if (!termo) {
      this.pacientesBusca = [...this.pacientes];
      return;
    }

    this.pacientesBusca = this.pacientes.filter((p) => {
      const nome = (p.nomeCompleto || '').toLowerCase();
      const cpf = (p.cpf || '').toLowerCase();
      const email = (p.email || '').toLowerCase();

      return nome.includes(termo) || cpf.includes(termo) || email.includes(termo);
    });
  }
}