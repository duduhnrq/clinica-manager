package br.com.clinica.model;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Endereco {
    private String rua;
    private String numero;
    private String bairro;
    private String cep;
    private String cidade;
    private String estado;
}