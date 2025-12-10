# 🤝 Como Contribuir para o Projeto Clinica Manager

Agradecemos imensamente seu interesse em contribuir com o desenvolvimento do nosso sistema de gerenciamento de clínica! Seu tempo e esforço são muito valiosos.

Para garantir um fluxo de trabalho eficiente, siga as diretrizes abaixo.

---

## 🛠️ 1. Configuração do Ambiente de Desenvolvimento

Este projeto é dividido em dois serviços principais: **Frontend (Angular)** e **Backend (Spring Boot)**, que devem ser executados simultaneamente.

### 1.1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* **Git**
* **Node.js e npm** (versão recomendada: 18+)
* **Java Development Kit (JDK)** (versão recomendada: 21+)
* **Maven** ou **Gradle** (para gerenciar o Backend)
* **Banco de Dados PostgreSQL** (instalado localmente ou um serviço como o Docker)

### 1.2. Configuração do Backend (Spring Boot)

O Backend está localizado na pasta `backend/`.

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/duduhnrq/clinica-manager
    cd clinica-manager/backend
    ```
2.  **Configure o Banco de Dados:**
    * Crie um banco de dados PostgreSQL local (ex: `clinica_db`).
    * Edite o arquivo `src/main/resources/application.properties` (ou `application.yml`) para apontar para suas credenciais locais:
        ```properties
        # Exemplo para application.properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/clinica_db
        spring.datasource.username=seu_usuario
        spring.datasource.password=sua_senha
        ```
3.  **Execute o Backend:**
    ```bash
    # Usando Maven:
    mvn spring-boot:run
    # OU
    # Usando Gradle:
    ./gradlew bootRun
    ```
    O Backend será iniciado em **`http://localhost:8080`**.

### 1.3. Configuração do Frontend (Angular)

O Frontend está localizado na pasta `frontend/clinica-frontend/`.

1.  **Acesse o Diretório:**
    ```bash
    cd ../frontend/clinica-frontend
    ```
2.  **Instale as Dependências:**
    ```bash
    npm install
    ```
3.  **Configure a URL da API (Obrigatório):**
    * Verifique se o arquivo `src/environments/environment.ts` está configurado para o endereço local do Backend:
        ```typescript
        export const environment = {
          production: false,
          // Deve apontar para o Backend local
          apiUrl: 'http://localhost:8080/api' 
        };
        ```
4.  **Execute o Frontend:**
    ```bash
    npm start
    # OU
    ng serve
    ```
    O Frontend será iniciado em **`http://localhost:4200`** e se conectará automaticamente ao Backend.

---

## 📦 2. Fluxo de Contribuição

Para garantir a qualidade do código, siga este fluxo padrão:

1.  **Fork** o repositório principal.
2.  **Clone** seu *fork* localmente.
3.  Crie uma **branch** para sua *feature* ou correção, utilizando uma convenção clara (ex: `feat/nome-da-feature` ou `fix/bug-cors`).
    ```bash
    git checkout -b nome-da-sua-branch
    ```
4.  Faça suas alterações e **testes** no ambiente local.
5.  **Commit** suas alterações com mensagens claras e descritivas (consulte a seção **3. Padrões de Commit**).
6.  **Push** sua branch para o GitHub.
    ```bash
    git push origin nome-da-sua-branch
    ```
7.  Abra um **Pull Request (PR)** para a branch `main` do repositório original.

---

## 📝 3. Padrões de Commit

Pedimos que siga o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para facilitar a geração de *changelogs* e a compreensão do histórico.

* `feat`: Uma nova *feature* (ex: `feat: adicao do modulo de agendamento`)
* `fix`: Uma correção de *bug* (ex: `fix: corrige falha 404 ao listar pacientes`)
* `docs`: Mudanças na documentação.
* `style`: Mudanças de formatação que não afetam o código (ex: ponto e vírgula, espaços).
* `refactor`: Mudança de código que não corrige um *bug* nem adiciona *feature* (ex: refatoração interna).
* `chore`: Mudanças em ferramentas ou configurações (ex: `chore: atualiza versao do angular`).

### Exemplo de Commit:

```bash
git commit -m "feat(paciente): adiciona campo naturalidade no cadastro"