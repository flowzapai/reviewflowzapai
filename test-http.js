const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><body><h1>ReviewFlow funcionando!</h1><p>Acesse <a href="/register">/register</a></p></body></html>');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor HTTP rodando em http://localhost:3000');
  console.log('Servidor HTTP rodando em http://127.0.0.1:3000');
});