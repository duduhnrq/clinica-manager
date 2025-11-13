package br.com.clinica.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

// Este 'record' é o nosso "Menu" ou "Contrato".
// É exatamente o que esperamos que o Angular nos envie.
// As anotações (@NotBlank, @Email) são para validação automática.
public record PacienteRequestDTO(
    
    @NotBlank // Não pode ser nulo nem vazio
    String nomeCompleto,
    
    @NotNull // Não pode ser nulo
    @Past     // A data deve ser no passado
    LocalDate dataNascimento,
    
    @NotBlank
    String naturalidade,
    
    @NotBlank
    String cpf,
    
    @NotBlank
    String identidade,
    
    @NotBlank
    String estadoCivil,
    
    @NotBlank
    @Email    // Deve ter formato de email válido
    String email,
    
    @NotBlank
    String telefone,
    
    String profissao, // Opcional, sem @NotBlank

    // Campos do Endereço (vêm "achatados" do formulário)
    @NotBlank
    String rua,

    @NotBlank
    String numero,

    @NotBlank
    String bairro,
    
    @NotBlank
    String cep,
    
    @NotBlank
    String cidade,

    @NotBlank
    String estado
) {}
