const { Client } = require('pg');

const client = new Client({
  host: 'flowzapai-postgres.cloudfy.live',
  port: 8653,
  user: 'postgres',
  password: 'zeRZo9phWB6qChUWuepb',
  database: 'db'
});

const tables = [
  `CREATE TABLE IF NOT EXISTS reviewflow.company (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cnpj TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    googleplaceid TEXT,
    googleapikey TEXT,
    plan TEXT DEFAULT 'STARTER',
    credits INT DEFAULT 100,
    isactive BOOLEAN DEFAULT true,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS reviewflow.companysettings (
    id TEXT PRIMARY KEY,
    companyid TEXT UNIQUE,
    businessname TEXT,
    welcomemessage TEXT,
    thankyoumessagepos TEXT,
    thankyoumessageneg TEXT,
    googlereviewurl TEXT,
    sendtiminghours INT DEFAULT 2,
    enablewhatsapp BOOLEAN DEFAULT true,
    enableemail BOOLEAN DEFAULT false,
    tonality TEXT DEFAULT 'amigavel',
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS reviewflow.user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER',
    companyid TEXT,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS reviewflow.client (
    id TEXT PRIMARY KEY,
    companyid TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    externalid TEXT,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS reviewflow.reviewrequest (
    id TEXT PRIMARY KEY,
    companyid TEXT,
    clientid TEXT,
    channel TEXT DEFAULT 'WHATSAPP',
    status TEXT DEFAULT 'PENDING',
    message TEXT,
    note INT,
    sentat TIMESTAMP,
    respondedat TIMESTAMP,
    redirectedtogoogle BOOLEAN DEFAULT false,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS reviewflow.review (
    id TEXT PRIMARY KEY,
    companyid TEXT,
    source TEXT DEFAULT 'GOOGLE',
    googlereviewid TEXT,
    authorname TEXT,
    rating INT,
    text TEXT,
    response TEXT,
    respondedat TIMESTAMP,
    createdat TIMESTAMP DEFAULT NOW()
  )`
];

async function createTables() {
  await client.connect();
  
  for (const sql of tables) {
    await client.query(sql);
    console.log('Tabela criada');
  }
  
  console.log('Todas as tabelas criadas!');
  client.end();
}

createTables().catch(console.error);