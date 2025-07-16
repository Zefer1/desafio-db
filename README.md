Desafio: Integração e Modelagem de Dados

Este projeto implementa uma API backend em **Node.js/Express** para gerir **Clientes**, **Produtos** e **Vendas**, usando **PostgreSQL** (via `pg`) e **MongoDB** (via Mongoose). Serve como exercício de modelagem relacional e NoSQL.


Pré‑requisitos

- **Node.js** v14+  
- **PostgreSQL** (porta padrão 5432)  
- **MongoDB** local (porta padrão 27017) ou conta em MongoDB Atlas  
- **Git**

Instalação

git clone https://github.com/Zefer1/desafio-db.git
cd o repositório
npm install

Configuração de Ambiente

Cria na raiz um ficheiro .env com:
PG_URI=postgres://postgres:postgres%20@localhost:5432/desafio_db
MONGO_URI=mongodb://127.0.0.1:27017/desafio_db
PORT=3000

Como Executar:
1- Criar as tabelas no Postgres
npm run init-db

2-Arrancar o servidor:
npm start

3- A API estará em http://localhost:3000

Endpoints:

PostgreSQL
| Método | Rota            | Descrição               |
| ------ | --------------- | ----------------------- |
| GET    | `/clientes`     | Lista clientes          |
| POST   | `/clientes`     | Cria cliente            |
| GET    | `/clientes/:id` | Detalha cliente         |
| PUT    | `/clientes/:id` | Atualiza cliente        |
| DELETE | `/clientes/:id` | Elimina cliente         |
| GET    | `/produtos`     | Lista produtos          |
| POST   | `/produtos`     | Cria produto            |
| GET    | `/produtos/:id` | Detalha produto         |
| PUT    | `/produtos/:id` | Atualiza produto        |
| DELETE | `/produtos/:id` | Elimina produto         |
| GET    | `/vendas`       | Lista vendas            |
| POST   | `/vendas`       | Regista venda + pedidos |
| GET    | `/vendas/:id`   | Detalha venda com itens |

MongoDB
| Método | Rota                  | Descrição                        |
| ------ | --------------------- | -------------------------------- |
| GET    | `/mongo/clientes`     | Lista clientes (MongoDB)         |
| POST   | `/mongo/clientes`     | Cria cliente (MongoDB)           |
| GET    | `/mongo/clientes/:id` | Detalha cliente (MongoDB)        |
| PUT    | `/mongo/clientes/:id` | Atualiza cliente (MongoDB)       |
| DELETE | `/mongo/clientes/:id` | Elimina cliente (MongoDB)        |
| GET    | `/mongo/produtos`     | Lista produtos (MongoDB)         |
| POST   | `/mongo/produtos`     | Cria produto (MongoDB)           |
| GET    | `/mongo/produtos/:id` | Detalha produto (MongoDB)        |
| PUT    | `/mongo/produtos/:id` | Atualiza produto (MongoDB)       |
| DELETE | `/mongo/produtos/:id` | Elimina produto (MongoDB)        |
| GET    | `/mongo/vendas`       | Lista vendas (MongoDB)           |
| POST   | `/mongo/vendas`       | Cria venda (MongoDB)             |
| GET    | `/mongo/vendas/:id`   | Detalha venda populada (MongoDB) |

Testes com Postman
Importa a coleção `postman/DesafioDB.postman_collection.json`. Tem pastas para:

1. SQL / Clientes  
2. SQL / Produtos  
3. SQL / Vendas  
4. Mongo / Clientes  
5. Mongo / Produtos  
6. Mongo / Vendas  

Cada request está configurado com body, headers e testes automáticos.

Desenvolvido por **José Fernandes** | [GitHub](https://https://github.com/Zefer1)