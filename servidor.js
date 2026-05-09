// Executável simples do servidor
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('==========================================');
console.log('   ReviewFlow - Iniciando Servidor');
console.log('==========================================');
console.log('');

// Inicia o Next.js
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
const args = ['start', '-p', '3000', '-H', '0.0.0.0'];

console.log('Executando: node next start');
console.log('');

const child = spawn(process.execPath, [nextPath, ...args], {
  cwd: __dirname,
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log('Servidor encerrado com código:', code);
});

console.log('Acesse: http://localhost:3000');
console.log('Pressione Ctrl+C para encerrar');
console.log('');

// Impede que o processo termine
process.stdin.resume();