package br.com.clinica.model;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Endereco {
    private String enderecoCompleto; // "Rua, número" do mockup
    private String bairro;
    private String cep;
    private String cidade;
}
