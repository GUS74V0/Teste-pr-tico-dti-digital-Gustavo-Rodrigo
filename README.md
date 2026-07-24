# Simulador de Entregas por Drone - Teste Prático (dti digital)

**Candidato:** Gustavo Rodrigo Campos

Um simulador logístico full-stack (Java + React) que aloca pedidos e gerencia a rota de drones num mapa 2D, desviando de áreas de exclusão e otimizando viagens.

---

## 🛠️ Tecnologias, Dependências e Ferramentas

Para executar este projeto nativamente ou via contêineres, as seguintes ferramentas e versões foram utilizadas e são requeridas:

### Backend

- **Java JDK:** 21 (Eclipse Temurin)
- **Spring Boot:** 3.x (Web, Data JPA, Validation)
- **Maven:** 3.9+ (Gerenciamento de dependências)
- **Banco de Dados:** PostgreSQL 16 com PostGIS (Porta 5432)

### Frontend

- **Node.js:** 20.x
- **React:** 18
- **Vite:** 5.x (Bundler)
- **TypeScript:** 5.x

### DevOps

- **Docker & Docker Compose:** Versão 24+

---

## 📥 Como Clonar o Repositório

Antes de executar, você precisa clonar o projeto para a sua máquina local. Abra o seu terminal e execute:

```bash
# Clone este repositório
git clone https://github.com/GUS74V0/Teste-pr-tico-dti-digital-Gustavo-Rodrigo.git

# Acesse a pasta do projeto
cd Teste-pr-tico-dti-digital-Gustavo-Rodrigo
```

---

## 🚀 Como Executar o Projeto

Existem duas formas de rodar o projeto: via **Docker Compose** (recomendado) ou rodando os serviços de forma avulsa (Local).

### Opção 1: Rodando via Docker (Recomendado)

A raiz do projeto contém um `docker-compose.yml` pré-configurado que levanta o banco de dados, compila o Spring Boot e serve o frontend React via NGINX.

1. Instale o Docker Desktop.
2. No terminal da raiz do repositório, rode:
   ```bash
   docker-compose up --build
   ```
3. Acesse o frontend: **http://localhost:3000**
4. A API rodará internamente na porta `:8080`.

### Opção 2: Rodando Localmente (Desenvolvimento)

Caso prefira debugar os códigos diretamente na sua máquina:

1. **Suba apenas o Banco de Dados:**
   ```bash
   docker-compose up postgres -d
   ```
2. **Execute o Backend (Spring Boot):**
   - Acesse a pasta `./spring-app`
   - Configure as variáveis de ambiente baseadas no `.env.example` ou `.env` criado.
   - Execute: `./mvnw spring-boot:run`
3. **Execute o Frontend (Vite):**
   - Acesse a pasta `./FrontEnd`
   - Execute: `npm install` e depois `npm run dev`
   - Acesse: **http://localhost:5173**

---

## 🧪 Testes Unitários

A suite de testes unitários automatizados garante as regras de negócio de alocação, controle de capacidade, e manipulação de entidades.

👉 **[Clique aqui para acessar a pasta de Testes Unitários](./spring-app/src/test/java/com/example/demo)**

Para rodar os testes manualmente:

```bash
cd spring-app
./mvnw test
```

---

## 🤖 Memórias e Prompts de IA

Este projeto contou com assistência de IA para o seu desenvolvimento. Todas as regras, constraints, reflexões (logs de chain-of-thought) e prompts utilizados para montar esta arquitetura podem ser conferidos no arquivo abaixo:

👉 **[AI_LOGS.md](./AI_LOGS.md)**
