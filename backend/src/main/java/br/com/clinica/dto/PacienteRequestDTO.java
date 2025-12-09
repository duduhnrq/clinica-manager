package br.com.clinica.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

// Agora é uma classe normal
public class PacienteRequestDTO {

    // --- CAMPOS PESSOAIS ---
    
    @NotBlank
    private String nomeCompleto;
    
    @NotNull
    @Past
    private LocalDate dataNascimento;
    
    @NotBlank
    private String naturalidade;
    
    @NotBlank
    private String cpf; 
    
    @NotBlank
    private String estadoCivil;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String telefone;
    
    private String profissao;

    // --- ENDEREÇO ANINHADO ---
    @NotNull 
    @Valid
    private EnderecoRequestDTO endereco;
    
    // Construtor vazio (necessário para a desserialização do Jackson)
    public PacienteRequestDTO() {} 

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public String getCpf() {
        return cpf;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }
    
    public String getNaturalidade() {
        return naturalidade;
    }
    
    public String getEstadoCivil() {
        return estadoCivil;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getTelefone() {
        return telefone;
    }
    
    public String getProfissao() {
        return profissao;
    }

    public EnderecoRequestDTO getEndereco() {
        return endereco;
    }
    
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    
}