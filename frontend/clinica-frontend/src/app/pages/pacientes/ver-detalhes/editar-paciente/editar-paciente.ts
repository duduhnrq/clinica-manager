import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacienteService } from '../../../../services/paciente.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-paciente',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-paciente.html',
  styleUrl: './editar-paciente.css',
})
export class EditarPaciente implements OnInit {
  id!: number;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nomeCompleto: [''],
      dataNascimento: [''],
      estadoCivil: [''],
      naturalidade: [''],
      cpf: [''],
      email: [''],
      profissao: [''],
      telefone: [''],

      cep: [''],
      rua: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarPaciente();
  }

  carregarPaciente() {
    this.pacienteService.buscarPorId(this.id).subscribe((p: any) => {
      const endereco = p.endereco || {};

      this.form.patchValue({
        ...p,
        rua: endereco.rua || '',
        numero: endereco.numero || '',
        bairro: endereco.bairro || '',
        cep: endereco.cep || '',
        cidade: endereco.cidade || '',
        estado: endereco.estado || '',
      });
    });
  }
  
  modalSucessoAberto = false;

  fecharModalSucesso() {
    this.modalSucessoAberto = false;
    this.router.navigate(['/pacientes/ver-detalhes', this.id]);
  }

  atualizar() {
    if (this.form.invalid) return;

    this.pacienteService.atualizar(this.id, this.form.value).subscribe(() => {
      this.modalSucessoAberto = true;
    });
  }
}
