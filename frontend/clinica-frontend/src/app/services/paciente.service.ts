import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  nomeCompleto: string;
  dataNascimento: string;
  estadoCivil: string;
  naturalidade: string;
  identidade: string;
  cpf: string;
  email: string;
  profissao: string;
  telefone: string;

  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/pacientes';

  constructor(private http: HttpClient) {}

  adicionar(paciente: Paciente): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }
}
