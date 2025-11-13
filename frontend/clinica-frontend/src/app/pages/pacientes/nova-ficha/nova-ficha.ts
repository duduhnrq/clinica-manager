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

  onCpfInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length <= 3) {
      event.target.value = value;
    } else if (value.length <= 6) {
      event.target.value = value.replace(/(\d{3})(\d+)/, '$1.$2');
    } else if (value.length <= 9) {
      event.target.value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
      event.target.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    this.paciente.cpf = event.target.value;
  }

  onTelefoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length <= 2) {
      event.target.value = `(${value}`;
    } else if (value.length <= 7) {
      event.target.value = value.replace(/(\d{2})(\d+)/, '($1) $2');
    } else if (value.length <= 11) {
      event.target.value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    }

    this.paciente.telefone = event.target.value;
  }

  onCepInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    if (value.length > 5) {
      event.target.value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    } else {
      event.target.value = value;
    }

    this.paciente.cep = event.target.value;
  }

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
        // só abre sucesso se não houve erro
        if (!this.modalErroAberto && !this.modalCpfAberto) {
          this.modalSucessoAberto = true;
        }
      },
      error: (err) => {
        console.error('Erro ao salvar paciente:', err);

        // tratamento de CPF duplicado
        if (
          err.status === 400 ||
          err.status === 409 ||
          (err.error &&
            typeof err.error.message === 'string' &&
            err.error.message.includes('CPF')) ||
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
