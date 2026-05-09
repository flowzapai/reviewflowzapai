const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, port, hostname: '0.0.0.0' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = require('http').createServer((req, res) => {
    handle(req, res);
  });

  server.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.error('Erro:', err);
      process.exit(1);
    }
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Servidor rodando em http://127.0.0.1:${port}`);
  });
});