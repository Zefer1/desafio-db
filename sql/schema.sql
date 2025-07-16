-- 1. Tabela Cliente
CREATE TABLE IF NOT EXISTS cliente (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  morada TEXT
);

-- 2. Tabela Produto
CREATE TABLE IF NOT EXISTS produto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  categoria VARCHAR(50)
);

-- 3. Tabela Venda
CREATE TABLE IF NOT EXISTS venda (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES cliente(id),
  data TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  total NUMERIC(12,2) NOT NULL
);

-- 4. Tabela Pedido (itens da venda)
CREATE TABLE IF NOT EXISTS pedido (
  id SERIAL PRIMARY KEY,
  venda_id INT NOT NULL REFERENCES venda(id),
  produto_id INT NOT NULL REFERENCES produto(id),
  quantidade INT NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL
);

-- 5. Tabela Estoque
CREATE TABLE IF NOT EXISTS estoque (
  id SERIAL PRIMARY KEY,
  produto_id INT UNIQUE NOT NULL REFERENCES produto(id),
  quantidade_disponivel INT NOT NULL,
  localizacao VARCHAR(100)
);
