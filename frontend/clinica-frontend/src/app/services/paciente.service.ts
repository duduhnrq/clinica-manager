import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

export interface Paciente {
  id?: number;
  nomeCompleto: string;
  dataNascimento: string;
  estadoCivil: string;
  naturalidade: string;
  cpf: string;
  email: string;
  profissao: string;
  telefone: string;

  endereco: Endereco;

  dataCadastro?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/pacientes';

  constructor(private http: HttpClient) {}

  /** ➕ Adicionar novo paciente */
  adicionar(paciente: Paciente): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }

  /** 📋 Listar todos os pacientes */
  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  /** 🔍 Buscar paciente por ID */
  buscarPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  /** ✏️ Atualizar paciente */
  atualizar(id: number, paciente: Paciente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paciente);
  }

  /** 🗑️ Excluir paciente */
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  remover(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
