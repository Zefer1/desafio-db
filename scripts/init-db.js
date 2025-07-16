
require('dotenv').config();               
const { Client } = require('pg');
const fs = require('fs');

console.log('🔍 Iniciando script de criação de tabelas...');
console.log('🔑 String de ligação (PG_URI):', process.env.PG_URI);

async function main() {
  // Cria o client com a URI do .env
  const client = new Client({
    connectionString: process.env.PG_URI
  });

  try {
    console.log('⏳ A tentar ligar ao PostgreSQL…');
    await client.connect();
    console.log('✅ Ligado ao PostgreSQL com sucesso!');

    console.log('📖 A ler o ficheiro SQL em sql/schema.sql');
    const sql = fs.readFileSync('sql/schema.sql', 'utf8');
    console.log('📄 Conteúdo SQL carregado (primeiras 200 chars):\n', sql.slice(0, 200), '...\n');

    console.log('🚀 A executar SQL...');
    const res = await client.query(sql);
    console.log('✅ SQL executado. Resultado:', res.command);

  } catch (err) {
    console.error('❌ Erro no script:', err);
  } finally {
    await client.end();
    console.log('🔒 Cliente PostgreSQL desligado.');
  }
}

main();
