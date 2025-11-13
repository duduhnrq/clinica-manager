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
    private pacienteService: PacienteService
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
}
