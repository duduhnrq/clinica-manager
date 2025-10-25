package br.com.clinica.controller; // Ajuste o pacote

import br.com.clinica.dto.PacienteRequestDTO;
import br.com.clinica.model.Paciente;
import br.com.clinica.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.List;

// @RestController combina @Controller e @ResponseBody
// Diz ao Spring que esta classe define endpoints REST (que retornam JSON)
@RestController 
// @RequestMapping define a URL base para todos os métodos nesta classe
@RequestMapping("/api/pacientes") 
public class PacienteController {

    // O Controller precisa do Service (o Garçom precisa do Chef)
    private final PacienteService pacienteService;

    // Pedimos ao Spring para injetar o PacienteService
    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    // @PostMapping diz ao Spring que este método responde a requisições HTTP POST
    // A URL completa será: POST /api/pacientes
    @PostMapping
    public ResponseEntity<Paciente> cadastrar(
            
            // @RequestBody diz: "Pegue o JSON do corpo da requisição 
            // e converta-o para um PacienteRequestDTO"
            
            // @Valid diz: "Aplique as validações (@NotBlank, @Email, etc.) 
            // que definimos no DTO. Se falhar, retorne um erro 400."
            @RequestBody @Valid PacienteRequestDTO dto, 
            
            // O UriComponentsBuilder é injetado para nos ajudar a 
            // construir a URL de resposta (o "Location" header)
            UriComponentsBuilder uriBuilder) {
        
        // 1. O Garçom (Controller) entrega o pedido (DTO) ao Chef (Service)
        // 2. O Chef (Service) processa, salva e devolve o Paciente criado
        Paciente pacienteSalvo = pacienteService.salvar(dto);

        // 3. Boa prática REST: Retornar a URL onde o novo recurso 
        //    (o paciente) pode ser encontrado.
        URI uri = uriBuilder
                    .path("/api/pacientes/{id}") // O template da URL
                    .buildAndExpand(pacienteSalvo.getId()) // Insere o ID do paciente
                    .toUri(); // Converte para uma URI

        // 4. Retornamos uma resposta HTTP 201 Created (sucesso!)
        //    - No header "Location", colocamos a 'uri'.
        //    - No corpo (body), colocamos os dados do paciente que foi salvo.
        return ResponseEntity.created(uri).body(pacienteSalvo);
    }
    
    /**
     * Endpoint para LISTAR TODOS ou PESQUISAR.
     * @RequestParam(required = false) torna o parâmetro "termo" opcional.
     */
    @GetMapping
    public ResponseEntity<List<Paciente>> listarOuPesquisar(
            @RequestParam(name = "termo", required = false) String termoPesquisa) {
        
        List<Paciente> pacientes;
        if (termoPesquisa == null || termoPesquisa.isBlank()) {
            // Se o parâmetro "termo" NÃO foi enviado, lista todos.
            pacientes = pacienteService.listarTodos();
        } else {
            // Se o parâmetro "termo" FOI enviado, pesquisa.
            pacientes = pacienteService.pesquisar(termoPesquisa);
        }
        
        // Retorna 200 OK com a lista de pacientes no corpo
        return ResponseEntity.ok(pacientes);
    }

    /**
     * Endpoint para BUSCAR UM PACIENTE POR ID.
     * @PathVariable pega o {id} da URL.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        
        // Usamos o .map() e .orElseGet() do Optional que veio do Service
        return pacienteService.buscarPorId(id)
                .map(pacienteEncontrado -> {
                    // Se o Optional contiver um paciente, retorna 200 OK
                    return ResponseEntity.ok(pacienteEncontrado);
                })
                .orElseGet(() -> {
                    // Se o Optional estiver vazio (não achou), retorna 404 Not Found
                    return ResponseEntity.notFound().build();
                });
    }
}