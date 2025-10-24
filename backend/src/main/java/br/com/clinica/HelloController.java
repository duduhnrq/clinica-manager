package br.com.clinica;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/candiadto")
    public String hello() {
        return "Backend funcionando com sucesso!";
    }
}