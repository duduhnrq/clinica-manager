import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PacienteService, Paciente } from '../../../services/paciente.service';

@Component({
  selector: 'app-ver-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ver-detalhes.html',
  styleUrls: ['./ver-detalhes.css'],
})
export class VerDetalhes implements OnInit {
  paciente?: Paciente;

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteService.buscarPorId(+id).subscribe({
        next: (dados) => (this.paciente = dados),
        error: (erro) => console.error('Erro ao carregar paciente:', erro),
      });
    }
  }

  editarPaciente() {
    if (this.paciente) {
      this.router.navigate(['pacientes/ver-detalhes/editar-paciente', this.paciente.id]);
    }
  }

  removerPaciente() {
    if (!this.paciente?.id) {
      alert('ID do paciente não encontrado.');
      return;
    }

    const confirmar = confirm(
      `Tem certeza que deseja remover o paciente "${this.paciente.nomeCompleto}"?`
    );
    if (!confirmar) return;

    this.pacienteService.remover(this.paciente.id).subscribe({
      next: () => this.router.navigate(['/pacientes']),
      error: (err) => {
        console.error('Erro ao remover paciente:', err);
        alert('Erro ao remover paciente.');
      },
    });
  }
}
