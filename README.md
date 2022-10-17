
# Desafio Yalo

## Notas:

- É necessário criar uma variável de ambiente `DATABASE_URL` com a url de conexão do banco de dados. Ou então criar um arquivo `.env` com essa variável na raiz do projeto **(já deixei um arquivo `env_example` que pode ser renomeado)**
- Deixei um devcontainer já com o banco de dados configurado (usar a `DATABASE_URL` do `env_example` se for usar esse container)
- Após a instalação das dependências e com a variável `DATABASE_URL` configurada, basta rodar `npx prisma db push` para criar os objetos no banco de dados (sem que seja necessário o uso do arquivo `.sql`)
- Defina a variável de ambiente `PORT` para alterar a porta do servidor (default 3000)

Obs.: Utilizei SQLite pra os testes de integração


## How To

Clone o projeto

```bash
  git clone https://github.com/matheust3/yalo_challenge.git
```

Entre no diretório do projeto

```bash
  cd yalo_challenge
```

Instale as dependências

```bash
  npm install
```

Crie o arquivo `.env`

```bash
  cp env_example .env
```
* **Obs.:** Verifique a variável `DATABASE_URL` se não estiver usando o banco de dados do devcontainer.

Crie os objetos necessários no banco de dados

```bash
  npx prisma db push
```
* **Obs.:** Use esse método como uma alternativa ao arquivo `.sql`.

Construa o projeto

```bash
  npm run build
```

Iniciei o servidor

```bash
  npm start
```


## Testes

- `npm run test:ci` -> Cobertura de testes, testes unitários e de integração
- `npm run test:unit` -> Testes unitários
- `npm run test:integration` -> Testes de integração
## Documentação da API

### Listagem dos alunos

```
  GET /api/alunos
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `id_turma`  | `int`      | **Opcional**. Filtro                |
| `id_colegio`| `int`      | **Opcional**. Filtro                |
| `score`     | `float`    | **Opcional**. Filtro                |

### Cadastro

```
  POST /api/alunos
```
body -> application/json

```json
{
    "id": 1, //int, (obrigatório)
    "cpf": "01234567890", //string, (obrigatório)
    "id_colegio": 1, //int (obrigatório)
    "id_turma": 1, //int (obrigatório)
    "name": "name", //string (opcional)
    "email": "email@d.com", //string (opcional)
    "score": 10.0 //float (opcional)
}
```

### Exclusão

```
  DELETE /api/alunos
```

| Parâmetro   | Tipo       | Descrição                             |
| :---------- | :--------- | :----------------------------------   |
| `id`        | `int`      | Obrigatório se não for passado o `cpf`|
| `cpf`       | `string`   | Obrigatório se não for passado o `id` |

### Atualização

```
  PUT /api/alunos
```
body -> application/json

```json
{
    "id": 1, //int, (obrigatório)
    "cpf": "01234567890", //string, (obrigatório)
    "id_colegio": 1, //int (obrigatório)
    "id_turma": 1, //int (obrigatório)
    "name": "name", //string (opcional)
    "email": "email@d.com", //string (opcional)
    "score": 10.0 //float (opcional)
}
```

### Busca (getById)

```
  GET /api/alunos/get-by-id
```

| Parâmetro   | Tipo       | Descrição                             |
| :---------- | :--------- | :----------------------------------   |
| `id`        | `int`      | **Obrigatório** id do alunos          |

## Autor

- [@matheust3](https://github.com/matheust3)
- [matheus.toniolli@hotmail.com](mailto:matheus.toniolli@hotmail.com)