package br.com.clinica.exception;

// Esta deve ser a única definição de classe no arquivo
public class RegraDeNegocioException extends RuntimeException {

    public RegraDeNegocioException(String mensagem) {
        // Passa a mensagem para o construtor da classe "pai" (RuntimeException)
        super(mensagem);
    }
}