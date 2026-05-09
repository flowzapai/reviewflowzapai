const { Client } = require('pg');

const client = new Client({
  host: 'flowzapai-postgres.cloudfy.live',
  port: 8653,
  user: 'postgres',
  password: 'zeRZo9phWB6qChUWuepb',
  database: 'db'
});

client.connect()
  .then(() => {
    console.log('Conectado ao banco!');
    return client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'reviewflow'");
  })
  .then(res => {
    console.log('Tabelas no schema reviewflow:');
    console.log(res.rows.map(r => r.tablename).join(', ') || 'Nenhuma tabela');
    client.end();
  })
  .catch(console.error);