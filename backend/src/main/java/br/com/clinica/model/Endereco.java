package br.com.clinica.model;

import lombok.Data;

@Data
public class Endereco {
    private String enderecoCompleto; // "Rua, número" do mockup
    private String bairro;
    private String cep;
    private String cidade;
}
