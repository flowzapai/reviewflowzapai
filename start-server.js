const { spawn } = require('child_process');
const server = spawn('node', ['node_modules/next/dist/bin/next', 'dev'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Erro ao iniciar servidor:', err);
});

setTimeout(() => {
  console.log('Servidor iniciado em http://localhost:3000');
}, 3000);