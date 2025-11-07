import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Paciente, PacienteService } from '../../../services/paciente.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-nova-ficha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './nova-ficha.html',
  providers: [PacienteService],
})
export class NovaFicha {
  paciente: Paciente = {
    nomeCompleto: '',
    dataNascimento: '',
    estadoCivil: '',
    naturalidade: '',
    identidade: '',
    cpf: '',
    email: '',
    profissao: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
  };

  modalSucessoAberto = false;
  modalErroAberto = false;
  modalObrigatorioAberto = false;
  modalCpfAberto = false;

  fecharModal() {
    this.modalErroAberto = false;
    this.modalObrigatorioAberto = false;
    this.modalCpfAberto = false;
  }
  
  fecharModalSucesso() {
    this.modalSucessoAberto = false;
    this.router.navigate(['/pacientes']);
  }

  constructor(private pacienteService: PacienteService, private router: Router) {}

  salvarFicha(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.modalObrigatorioAberto = true;
      return;
    }

    console.log('Dados enviados para API:', this.paciente);

    this.pacienteService.adicionar(this.paciente).subscribe({
      next: () => {
        this.modalSucessoAberto = true;
      },
      error: (err) => {
        console.error('Erro ao salvar paciente:', err);

        // ✅ tratamento para CPF já cadastrado
        if (
          err.status === 409 ||
          (err.error && typeof err.error === 'string' && err.error.includes('CPF'))
        ) {
          this.modalCpfAberto = true;
          return;
        }

        this.modalErroAberto = true;
      },
    });
  }
}
