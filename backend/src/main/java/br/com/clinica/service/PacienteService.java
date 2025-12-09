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
    // PacienteService.java

    @Transactional
    public Paciente salvar(PacienteRequestDTO dto) {

        System.out.println("Valor do CPF recebido no DTO (Backend): " + dto.getCpf());

        // --- REGRA DE NEGÓCIO 1: Validar duplicados ---
        if (pacienteRepository.findByCpf(dto.getCpf()).isPresent()) {
            throw new RegraDeNegocioException("CPF já cadastrado no sistema.");
        }

        if (pacienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RegraDeNegocioException("Email já cadastrado no sistema.");
        }

        // --- LÓGICA DE MAPEAMENTO: Converter DTO para Entidade ---

        // 1. Criar e preencher o Endereco embutido (Deixando como estava no seu código)
        Endereco endereco = new Endereco();
        endereco.setRua(dto.getEndereco().rua());
        endereco.setNumero(dto.getEndereco().numero());
        endereco.setBairro(dto.getEndereco().bairro());
        endereco.setCep(dto.getEndereco().cep());
        endereco.setCidade(dto.getEndereco().cidade());
        endereco.setEstado(dto.getEndereco().estado());

        // 2. Criar e preencher o Paciente
        Paciente paciente = new Paciente();

        paciente.setNomeCompleto(dto.getNomeCompleto());
        paciente.setDataNascimento(dto.getDataNascimento());
        paciente.setNaturalidade(dto.getNaturalidade());
        paciente.setCpf(dto.getCpf()); // <--- O CAMPO QUE ESTAVA FALTANDO!
        paciente.setEstadoCivil(dto.getEstadoCivil());
        paciente.setEmail(dto.getEmail());
        paciente.setTelefone(dto.getTelefone());
        paciente.setProfissao(dto.getProfissao());

        // 3. Atribuir o objeto Endereco ao Paciente
        paciente.setEndereco(endereco);

        // 4. Salvar
        return pacienteRepository.save(paciente);
    }

    /**
     * Lista todos os pacientes do banco.
     * 
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
        return pacienteRepository
                .findByNomeCompletoContainingIgnoreCaseOrEmailContainingIgnoreCaseOrTelefoneContainingIgnoreCase(
                        termo, termo, termo);
    }

    /**
     * Atualiza um paciente existente.
     * Se o paciente não for encontrado, lança RuntimeException.
     * Se houver conflito de CPF ou Email (pertencentes a outro paciente), lança
     * RegraDeNegocioException.
     */
    @Transactional
    public Paciente atualizar(Long id, PacienteRequestDTO dto) {
        // Busca o paciente existente
        Paciente pacienteExistente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado para atualização."));

        // --- Regras de negócio: Evitar duplicidade em CPF e Email ---
        pacienteRepository.findByCpf(dto.getCpf())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new RegraDeNegocioException("CPF já está cadastrado em outro paciente.");
                });

        pacienteRepository.findByEmail(dto.getEmail())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new RegraDeNegocioException("Email já está cadastrado em outro paciente.");
                });

        // --- Atualiza os campos básicos ---
        pacienteExistente.setNomeCompleto(dto.getNomeCompleto());
        pacienteExistente.setDataNascimento(dto.getDataNascimento());
        pacienteExistente.setNaturalidade(dto.getNaturalidade());
        pacienteExistente.setCpf(dto.getCpf());
        pacienteExistente.setEstadoCivil(dto.getEstadoCivil());
        pacienteExistente.setEmail(dto.getEmail());
        pacienteExistente.setTelefone(dto.getTelefone());
        pacienteExistente.setProfissao(dto.getProfissao());

        // --- Atualiza endereço (mantendo o objeto embutido) ---
        if (pacienteExistente.getEndereco() == null) {
            pacienteExistente.setEndereco(new Endereco());
        }
        pacienteExistente.getEndereco().setRua(dto.getEndereco().rua());
        pacienteExistente.getEndereco().setNumero(dto.getEndereco().numero());
        pacienteExistente.getEndereco().setBairro(dto.getEndereco().bairro());
        pacienteExistente.getEndereco().setCep(dto.getEndereco().cep());
        pacienteExistente.getEndereco().setCidade(dto.getEndereco().cidade());
        pacienteExistente.getEndereco().setEstado(dto.getEndereco().estado());

        // --- Salva novamente no banco ---
        return pacienteRepository.save(pacienteExistente);
    }

    /**
     * Remove um paciente pelo ID.
     * Se não encontrar, lança RuntimeException.
     */
    @Transactional
    public void remover(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new RuntimeException("Paciente não encontrado para remoção.");
        }
        pacienteRepository.deleteById(id);
    }
}
