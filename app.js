require('dotenv').config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Ligado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao ligar MongoDB:', err));

const express = require('express');
const pool = require('./db/pool');
const app = express();
app.use(express.json());

// ========== Clientes ==========

// GET /clientes — lista todos
app.get('/clientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cliente ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

// POST /clientes — cria novo
app.post('/clientes', async (req, res) => {
  const { nome, email, telefone, morada } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cliente (nome, email, telefone, morada)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, email, telefone, morada]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro no INSERT cliente:', err.code, err.detail);
    if (err.code === '23505' && err.constraint === 'cliente_email_key') {
      return res.status(400).json({ error: 'Email já existe' });
    }
    return res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

// GET /clientes/:id — detalhe
app.get('/clientes/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM cliente WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// PUT /clientes/:id — atualiza
app.put('/clientes/:id', async (req, res) => {
  const { nome, email, telefone, morada } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE cliente
       SET nome=$1, email=$2, telefone=$3, morada=$4
       WHERE id=$5
       RETURNING *`,
      [nome, email, telefone, morada, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// DELETE /clientes/:id — remove
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM cliente WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar cliente' });
  }
});

// ========== Produtos ==========

// GET /produtos — lista todos
app.get('/produtos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produto ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// POST /produtos — cria novo
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, categoria } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO produto (nome, descricao, preco, categoria)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nome, descricao, preco, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// GET /produtos/:id — detalhe
app.get('/produtos/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM produto WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// PUT /produtos/:id — atualiza
app.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, preco, categoria } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE produto
       SET nome=$1, descricao=$2, preco=$3, categoria=$4
       WHERE id=$5
       RETURNING *`,
      [nome, descricao, preco, categoria, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE /produtos/:id — elimina
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM produto WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar produto' });
  }
});

// ========== Vendas ==========

// POST /vendas — cria uma venda e os respetivos pedidos
app.post('/vendas', async (req, res) => {
  const { cliente_id, itens } = req.body;
  const total = itens.reduce((sum, i) => sum + i.quantidade * i.preco_unitario, 0);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const vendaRes = await client.query(
      `INSERT INTO venda (cliente_id, total)
       VALUES ($1, $2)
       RETURNING *`,
      [cliente_id, total]
    );
    const venda = vendaRes.rows[0];

    await Promise.all(
      itens.map(i =>
        client.query(
          `INSERT INTO pedido (venda_id, produto_id, quantidade, preco_unitario)
           VALUES ($1, $2, $3, $4)`,
          [venda.id, i.produto_id, i.quantidade, i.preco_unitario]
        )
      )
    );

    await client.query('COMMIT');
    res.status(201).json({ venda_id: venda.id, cliente_id, total, itens });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar venda:', err);
    res.status(500).json({ error: 'Erro ao criar venda' });
  } finally {
    client.release();
  }
});

// GET /vendas — lista vendas (sem itens)
app.get('/vendas', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, cliente_id, data, total FROM venda ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});

// GET /vendas/:id — detalhes da venda com itens
app.get('/vendas/:id', async (req, res) => {
  const vendaId = req.params.id;
  try {
    const vendaRes = await pool.query(
      'SELECT id, cliente_id, data, total FROM venda WHERE id = $1',
      [vendaId]
    );
    if (vendaRes.rows.length === 0)
      return res.status(404).json({ error: 'Venda não encontrada' });

    const venda = vendaRes.rows[0];
    const itensRes = await pool.query(
      `SELECT produto_id, quantidade, preco_unitario
       FROM pedido
       WHERE venda_id = $1`,
      [vendaId]
    );

    res.json({ ...venda, itens: itensRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar venda' });
  }
});

// ==== Rotas MongoDB ==== 
const ClienteMongo = require('./models/Cliente');
const ProdutoMongo = require('./models/Produto');
const VendaMongo   = require('./models/Venda');

// GET /mongo/clientes
app.get('/mongo/clientes', async (req, res) => {
  const docs = await ClienteMongo.find();
  res.json(docs);
});

// POST /mongo/clientes
app.post('/mongo/clientes', async (req, res) => {
  try {
    const cli = await ClienteMongo.create(req.body);
    res.status(201).json(cli);
  } catch (err) {
    if (err.code === 11000) // duplicate key
      return res.status(400).json({ error: 'Email já existe (Mongo)' });
    res.status(500).json({ error: 'Erro ao criar cliente (Mongo)' });
  }
});

// (similar para GET /mongo/clientes/:id, PUT, DELETE)

// GET /mongo/produtos
app.get('/mongo/produtos', async (req, res) => {
  res.json(await ProdutoMongo.find());
});

// POST /mongo/produtos
app.post('/mongo/produtos', async (req, res) => {
  try { res.status(201).json(await ProdutoMongo.create(req.body)); }
  catch { res.status(500).json({ error: 'Erro ao criar produto (Mongo)' }); }
});


// POST /mongo/vendas
app.post('/mongo/vendas', async (req, res) => {
  const { cliente, itens } = req.body;
  const total = itens.reduce((s,i)=>s + i.quantidade * i.preco_unitario, 0);
  try {
    const venda = new VendaMongo({ cliente, itens, total });
    await venda.save();
    res.status(201).json(venda);
  } catch {
    res.status(500).json({ error: 'Erro ao criar venda (Mongo)' });
  }
});

// GET /mongo/vendas, GET /mongo/vendas/:id (com populate)
app.get('/mongo/vendas/:id', async (req, res) => {
  const v = await VendaMongo.findById(req.params.id)
            .populate('cliente')
            .populate('itens.produto');
  if (!v) return res.status(404).json({ error: 'Venda não encontrada (Mongo)' });
  res.json(v);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor a correr na porta ${PORT}`));
