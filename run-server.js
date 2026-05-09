const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

console.log('Iniciando servidor Next.js...');

const server = spawn(
  process.execPath,
  [path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start'],
  {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
    windowsHide: true
  }
);

server.stdout.on('data', (data) => {
  const msg = data.toString();
  logStream.write('[stdout] ' + msg);
  console.log(msg.trim());
});

server.stderr.on('data', (data) => {
  const msg = data.toString();
  logStream.write('[stderr] ' + msg);
  console.error(msg.trim());
});

server.on('error', (err) => {
  console.error('Erro ao iniciar:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log('Servidor encerrado com código:', code);
  process.exit(code);
});

console.log('PID do servidor:', server.pid);
console.log('Acesse: http://localhost:3000');