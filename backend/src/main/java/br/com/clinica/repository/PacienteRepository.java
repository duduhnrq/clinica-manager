package br.com.clinica.repository;

import br.com.clinica.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Isso é uma interface, não uma classe
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    
    // Ao estender JpaRepository<Paciente, Long>, o Spring magicamente
    // nos dá métodos prontos como:
    // - save()
    // - findById()
    // - findAll()
    // - deleteById()
    
    // Além disso, podemos criar métodos de busca customizados.
    // O Spring entende o nome do método e cria a consulta (query) sozinho:
    
    Optional<Paciente> findByNomeCompleto(String nomeCompleto);
    Optional<Paciente> findByEmail(String email);
    Optional<Paciente> findByCpf(String cpf);
    List<Paciente> findByNomeCompletoContainingIgnoreCaseOrEmailContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
            String termo, String termo2, String termo3);
}
