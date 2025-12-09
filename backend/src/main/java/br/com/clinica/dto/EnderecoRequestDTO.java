package br.com.clinica.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EnderecoRequestDTO(
    @NotBlank
    String rua,

    @NotBlank
    String numero,

    @NotBlank
    String bairro,
 
    @NotBlank
    @Size(min = 8, max = 9)
    String cep,
 
    @NotBlank
    String cidade,

    @NotBlank
    String estado
) {}