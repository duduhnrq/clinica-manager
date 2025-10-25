package br.com.clinica.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import br.com.clinica.dto.ErroRespostaDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // @ExceptionHandler diz: "Se um Controller lançar uma RegraDeNegocioException,
    // execute este método em vez de explodir em um Erro 500."
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ErroRespostaDTO> handleRegraDeNegocio(RegraDeNegocioException ex) {
        
        // 1. Pega a mensagem da exceção (ex: "CPF já cadastrado")
        String mensagemDeErro = ex.getMessage();
        
        // 2. Cria nosso DTO de resposta
        ErroRespostaDTO erroDTO = new ErroRespostaDTO(mensagemDeErro);

        // 3. Retorna uma resposta HTTP 400 Bad Request (em vez de 500)
        //    com o DTO de erro no corpo da resposta.
        //    (Poderia ser 409 Conflict, mas 400 é mais comum para regras de negócio)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroDTO);
    }
    
    // (Bônus: Podemos adicionar outros métodos aqui para tratar outros erros,
    // como os erros de validação @Valid, que retornam 400 automaticamente,
    // mas com mensagens feias. Poderíamos formatá-los aqui também.)
}