const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

function log(msg) {
  const timestamp = new Date().toISOString();
  logFile.write(`[${timestamp}] ${msg}\n`);
  console.log(`[${timestamp}] ${msg}`);
}

log('Iniciando servidor Next.js...');

const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const server = spawn(process.execPath, [nextPath, 'start', '-p', '3000', '-H', '0.0.0.0'], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true
});

server.stdout.on('data', (data) => {
  log('[OUT] ' + data.toString().trim());
});

server.stderr.on('data', (data) => {
  log('[ERR] ' + data.toString().trim());
});

server.on('error', (err) => {
  log('ERRO: ' + err.message);
  process.exit(1);
});

server.on('exit', (code) => {
  log('Processo encerrado com código: ' + code);
  process.exit(code);
});

log('Servidor iniciado! PID: ' + server.pid);
log('Acesse: http://localhost:3000');

// Mantém o processo vivo
process.stdin.resume();