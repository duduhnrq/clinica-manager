package br.com.clinica.model; // Ajuste o pacote

import jakarta.persistence.*; // Importa as anotações do JPA
import lombok.Data;

import java.time.LocalDate;

// @Entity diz ao Spring: "Esta classe é uma tabela no banco de dados"
@Entity 
// @Table(name = "...") define o nome exato da tabela
@Table(name = "pacientes")
@Data 
public class Paciente {

    // @Id indica que este campo é a Chave Primária
    @Id 
    // @GeneratedValue diz ao banco para gerar o valor (ex: auto-incremento)
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    // @Column permite configurar a coluna (ex: not null)
    @Column(nullable = false) 
    private String nomeCompleto;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false)
    private String naturalidade;

    @Column(nullable = false, unique = true) // CPF é obrigatório e único
    private String cpf;

    @Column(nullable = false)
    private String identidade;

    @Column(nullable = false)
    private String estadoCivil;

    @Column(nullable = false, unique = true) // Email também é obrigatório e único
    private String email;

    @Column(nullable = false)
    private String telefone;

    private String profissao; // Opcional (sem 'nullable = false')

    // @Embedded diz: "Traga todos os campos da classe Endereco para esta tabela"
    @Embedded 
    private Endereco endereco;

}