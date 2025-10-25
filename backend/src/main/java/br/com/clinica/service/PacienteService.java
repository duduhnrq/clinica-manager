package br.com.clinica.service;

import br.com.clinica.dto.PacienteRequestDTO;
import br.com.clinica.exception.RegraDeNegocioException;
import br.com.clinica.model.Endereco;
import br.com.clinica.model.Paciente;
import br.com.clinica.repository.PacienteRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// @Service diz ao Spring: "Esta classe é um componente de serviço"
// O Spring vai gerenciá-la para nós (criar uma instância, etc.)
@Service
public class PacienteService {

    // Precisamos do Repository para falar com o banco
    private final PacienteRepository pacienteRepository;

    // Pedimos ao Spring para "injetar" o Repository aqui
    // Isso é chamado de Injeção de Dependência
    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    // @Transactional garante que esta operação inteira (salvar)
    // ou funciona por completo, ou falha por completo (nunca pela metade).
    @Transactional
    public Paciente salvar(PacienteRequestDTO dto) {
        
        // --- REGRA DE NEGÓCIO 1: Validar duplicados ---
        // Usamos os métodos que criamos no Repository
        if (pacienteRepository.findByCpf(dto.cpf()).isPresent()) {
            throw new RegraDeNegocioException("CPF já cadastrado no sistema."); // MUDOU
        }
        
        // 3. E MUDE AQUI
        if (pacienteRepository.findByEmail(dto.email()).isPresent()) {
            throw new RegraDeNegocioException("Email já cadastrado no sistema."); // MUDOU
        }

        // --- LÓGICA DE MAPEAMENTO: Converter DTO para Entidade ---
        
        // 1. Criar e preencher o Endereco embutido
        Endereco endereco = new Endereco();
        endereco.setEnderecoCompleto(dto.enderecoCompleto());
        endereco.setBairro(dto.bairro());
        endereco.setCep(dto.cep());
        endereco.setCidade(dto.cidade());
        
        // 2. Criar e preencher o Paciente
        Paciente paciente = new Paciente();
        paciente.setNomeCompleto(dto.nomeCompleto());
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setNaturalidade(dto.naturalidade());
        paciente.setCpf(dto.cpf());
        paciente.setIdentidade(dto.identidade());
        paciente.setEstadoCivil(dto.estadoCivil());
        paciente.setEmail(dto.email());
        paciente.setTelefone(dto.telefone());
        paciente.setProfissao(dto.profissao());
        
        // 3. Atribuir o objeto Endereco ao Paciente
        paciente.setEndereco(endereco);

        // 4. Chamar o Repository (o "Assistente") para salvar no banco
        return pacienteRepository.save(paciente);
    }
    

    
    /**
     * Lista todos os pacientes do banco.
     * @Transactional(readOnly = true) é uma otimização para consultas.
     */
    @Transactional(readOnly = true)
    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    /**
     * Busca um único paciente pelo seu ID.
     * Retorna um Optional (pode ou não encontrar).
     */
    @Transactional(readOnly = true)
    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    /**
     * Chama o novo método de pesquisa do repositório.
     * Passamos o mesmo "termo" para os três campos.
     */
    @Transactional(readOnly = true)
    public List<Paciente> pesquisar(String termo) {
        return pacienteRepository.findByNomeCompletoContainingIgnoreCaseOrEmailContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                termo, termo, termo);
    }
}
