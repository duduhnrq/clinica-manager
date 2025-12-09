import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';

interface Agendamento {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipo: string;
  procedimento: string;
  data: string;
  horario: string;
}

interface DiasComAgendamentos {
  data: string;
  dia: string;
  mes: number;
  ano: number;
  diaSemana: string;
  agendamentos: Agendamento[];
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class Agenda implements OnInit {
  modalAberto = false;
  modalSucessoAberto = false;
  modalErroAberto = false;
  modalDataAberto = false;
  modalConfirmacaoAberto = false;

  agendamentoParaDeletarId: number | null = null;

  editandoAgendamento: Agendamento | null = null;
  agendamentoIdEdicao: number | null = null;

  form!: FormGroup;
  dataForm!: FormGroup;

  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  mostrarListaPacientes = false;
  pacienteSelecionado: any | null = null;

  mesAtual = new Date().getMonth();
  anoAtual = new Date().getFullYear();
  nomeMes = '';

  meses = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  years: number[] = [];

  agendamentos: Agendamento[] = [];
  diasComAgendamentos: DiasComAgendamentos[] = [];
  agendamentosDataSelecionada: Agendamento[] = [];
  dataSelecionada: string = '';
  dataSelecionadaIso: string = '';

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit() {
    this.agendamentos = this.agendamentoService.carregarAgendamentos();

    this.form = this.fb.group({
      pacienteId: ['', Validators.required],
      pacienteBusca: [''],
      tipo: ['', Validators.required],
      procedimento: [''],
      data: ['', Validators.required],
      horario: ['', Validators.required],
    });

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    this.dataForm = this.fb.group({
      mes: [this.mesAtual, Validators.required],
      ano: [this.anoAtual, Validators.required],
    });

    this.carregarPacientes();
    this.setupBuscaPaciente();
    this.atualizarNomeMes();
    this.carregarAgendamentosDoMes();

    setTimeout(() => {
      if (this.diasComAgendamentos.length > 0) {
        this.selecionarDia(this.diasComAgendamentos[0]);
      }
    }, 300);

    this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'operacao') {
        this.form.get('procedimento')?.setValidators([Validators.required]);
      } else {
        this.form.get('procedimento')?.clearValidators();
      }
      this.form.get('procedimento')?.updateValueAndValidity();
    });
  }

  atualizarNomeMes() {
    const meses = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];
    this.nomeMes = `${meses[this.mesAtual]} de ${this.anoAtual}`;
  }

  mesAnterior() {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    } else {
      this.mesAtual--;
    }
    this.atualizarNomeMes();
    this.dataSelecionada = '';
    this.dataSelecionadaIso = '';
    this.agendamentosDataSelecionada = [];
    this.carregarAgendamentosDoMes();
  }

  proximoMes() {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else {
      this.mesAtual++;
    }
    this.atualizarNomeMes();
    this.dataSelecionada = '';
    this.dataSelecionadaIso = '';
    this.agendamentosDataSelecionada = [];
    this.carregarAgendamentosDoMes();
  }

  abrirModalData() {
    this.dataForm.setValue({ mes: this.mesAtual, ano: this.anoAtual });
    this.modalDataAberto = true;
  }

  fecharModalData() {
    this.modalDataAberto = false;
  }

  confirmarData() {
    if (this.dataForm.invalid) {
      return;
    }
    const val = this.dataForm.value;
    this.mesAtual = val.mes;
    this.anoAtual = val.ano;
    this.atualizarNomeMes();

    this.dataSelecionada = '';
    this.dataSelecionadaIso = '';
    this.agendamentosDataSelecionada = [];

    this.carregarAgendamentosDoMes();

    if (this.diasComAgendamentos.length > 0) {
      this.selecionarDia(this.diasComAgendamentos[0]);
    }

    this.fecharModalData();
  }

  carregarAgendamentosDoMes() {
    this.diasComAgendamentos = [];

    const agendamentosDoMes = this.agendamentos.filter((ag) => {
      const [ano, mes, dia] = ag.data.split('-').map(Number);
      const mesAgendamento = mes - 1;

      return mesAgendamento === this.mesAtual && ano === this.anoAtual;
    });

    const diasUnicos = new Map<string, Agendamento[]>();
    agendamentosDoMes.forEach((ag) => {
      if (!diasUnicos.has(ag.data)) {
        diasUnicos.set(ag.data, []);
      }
      diasUnicos.get(ag.data)!.push(ag);
    });

    diasUnicos.forEach((ags, data) => {
      const [ano, mes, dia] = data.split('-').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);

      const opcoes: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const diaSemana = dataObj.toLocaleDateString('pt-BR', opcoes);
      const diaStr = String(dia).padStart(2, '0');
      const mesStr = String(mes).padStart(2, '0');

      this.diasComAgendamentos.push({
        data,
        dia: diaStr,
        mes: mes,
        ano: ano,
        diaSemana: this.capitalizarPrimeira(diaSemana),
        agendamentos: ags.sort((a, b) => a.horario.localeCompare(b.horario)),
      });
    });

    this.diasComAgendamentos.sort((a, b) => a.data.localeCompare(b.data));
  }

  capitalizarPrimeira(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  selecionarDia(dia: DiasComAgendamentos) {
    if (dia.data === this.dataSelecionadaIso) {
      this.dataSelecionadaIso = '';
      this.dataSelecionada = '';
      this.agendamentosDataSelecionada = [];
    } else {
      this.dataSelecionada = `${dia.dia}/${dia.mes}/${dia.ano}`;
      this.dataSelecionadaIso = dia.data;
      this.agendamentosDataSelecionada = dia.agendamentos;
    }
  }

  setupBuscaPaciente() {
    const control = this.form.get('pacienteBusca');
    control?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((texto: string) => {
          texto = texto?.trim() ?? '';
          if (!texto || texto.length < 2) {
            this.mostrarListaPacientes = false;
            if (!this.pacienteSelecionado) {
              this.form.get('pacienteId')?.setValue('');
            }
            return of([] as any[]);
          }

          const s: any = this.pacienteService as any;

          if (s.buscar && typeof s.buscar === 'function') {
            return s.buscar(texto).pipe(catchError(() => of([] as any[])));
          }

          if (s.listar && typeof s.listar === 'function') {
            return s.listar().pipe(
              map((list: any[]) =>
                (list || []).filter((p) =>
                  (p.nomeCompleto || '').toLowerCase().includes(texto.toLowerCase())
                )
              ),
              catchError(() => of([] as any[]))
            );
          }

          return of([] as any[]);
        })
      )
      .subscribe((resultados: unknown) => {
        const lista = (resultados as any[]) || [];
        this.pacientesFiltrados = lista;
        this.mostrarListaPacientes = lista.length > 0;
      });
  }

  abrirModal() {
    this.editandoAgendamento = null;
    this.agendamentoIdEdicao = null;
    this.form.reset({ tipo: '', pacienteBusca: '' });
    this.modalAberto = true;
  }

  abrirModalEdicao(agendamento: Agendamento) {
    this.editandoAgendamento = agendamento;
    this.agendamentoIdEdicao = agendamento.id;

    const paciente = this.pacientes.find((p) => p.id === agendamento.pacienteId) || null;
    this.pacienteSelecionado = paciente || null;

    this.form.patchValue({
      pacienteId: agendamento.pacienteId,
      pacienteBusca: paciente ? paciente.nomeCompleto : '',
      tipo: agendamento.tipo,
      procedimento: agendamento.procedimento,
      data: agendamento.data,
      horario: agendamento.horario,
    });
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.pacienteSelecionado = null;
    this.mostrarListaPacientes = false;
    this.editandoAgendamento = null;
    this.agendamentoIdEdicao = null;
    this.form.reset({ tipo: '', pacienteBusca: '' });
    this.modalSucessoAberto = false;
    this.modalErroAberto = false;
    this.modalConfirmacaoAberto = false;
  }

  carregarPacientes() {
    const s: any = this.pacienteService as any;
    if (s.listar && typeof s.listar === 'function') {
      s.listar()
        .pipe(catchError(() => of([])))
        .subscribe((list: any[]) => {
          this.pacientes = list || [];
          this.pacientesFiltrados = this.pacientes;
        });
    } else {
      this.pacientes = [];
      this.pacientesFiltrados = [];
    }
  }

  filtrarPacientes(texto: string) {
    const filtro = texto.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter((p) =>
      p.nomeCompleto.toLowerCase().includes(filtro)
    );
  }

  selecionarPaciente(paciente: any) {
    this.pacienteSelecionado = paciente;
    this.form.get('pacienteId')?.setValue(paciente.id);
    this.form.get('pacienteBusca')?.setValue(paciente.nomeCompleto, { emitEvent: false });
    this.mostrarListaPacientes = false;
  }

  salvarAgendamento() {
    if (this.form.valid) {
      const dataSelecionada = this.form.value.data;

      if (this.editandoAgendamento && this.agendamentoIdEdicao !== null) {
        const index = this.agendamentos.findIndex((ag) => ag.id === this.agendamentoIdEdicao);
        if (index !== -1) {
          this.agendamentos[index] = {
            id: this.agendamentoIdEdicao,
            pacienteId: this.form.value.pacienteId,
            pacienteNome: this.pacienteSelecionado?.nomeCompleto || '',
            tipo: this.form.value.tipo,
            procedimento: this.form.value.procedimento,
            data: this.form.value.data,
            horario: this.form.value.horario,
          };
          this.agendamentoService.atualizarAgendamento(
            this.agendamentoIdEdicao,
            this.agendamentos[index]
          );
        }
      } else {
        const novoAgendamento: Agendamento = {
          id: Date.now(),
          pacienteId: this.form.value.pacienteId,
          pacienteNome: this.pacienteSelecionado?.nomeCompleto || '',
          tipo: this.form.value.tipo,
          procedimento: this.form.value.procedimento,
          data: this.form.value.data,
          horario: this.form.value.horario,
        };

        this.agendamentos.push(novoAgendamento);
        this.agendamentoService.adicionarAgendamento(novoAgendamento);
      }

      this.carregarAgendamentosDoMes();
      this.dataSelecionadaIso = dataSelecionada;
      const dia = this.diasComAgendamentos.find((d) => d.data === dataSelecionada);
      if (dia) {
        this.dataSelecionada = `${dia.dia}/${dia.mes}/${dia.ano}`;
        this.agendamentosDataSelecionada = dia.agendamentos;
      }

      this.modalSucessoAberto = true;
      setTimeout(() => {
        this.fecharModal();
      }, 1500);
    } else {
      this.form.markAllAsTouched();
      this.modalErroAberto = true;
    }
  }

  abrirModalConfirmacao(id: number) {
    this.agendamentoParaDeletarId = id;
    this.modalConfirmacaoAberto = true;
  }

  // agenda.ts
confirmarDelecao() {
    if (this.agendamentoParaDeletarId !== null) {
        this.deletarAgendamento(this.agendamentoParaDeletarId); 
    }
    this.fecharModal();
    this.agendamentoParaDeletarId = null;
}

  deletarAgendamento(id: number) {
    this.agendamentos = this.agendamentos.filter((ag) => ag.id !== id);
    this.agendamentoService.deletarAgendamento(id);
    this.carregarAgendamentosDoMes();
    if (this.dataSelecionada) {
      this.agendamentosDataSelecionada = this.agendamentosDataSelecionada.filter(
        (ag) => ag.id !== id
      );
    }
  }

  exportarAgendamentos() {
    const json = this.agendamentoService.exportarJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  obterTotalAgendamentos(): number {
    return this.agendamentos.length;
  }

  obterTotalConsultas(): number {
    return this.agendamentos.filter((ag) => ag.tipo === 'consulta').length;
  }

  obterTotalOperacoes(): number {
    return this.agendamentos.filter((ag) => ag.tipo === 'operacao').length;
  }
}
