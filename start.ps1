const childProcess = require('child_process');

console.log('Iniciando Next.js...');

const isWindows = process.platform === 'win32';
const shell = isWindows ? 'cmd.exe' : '/bin/sh';
const args = isWindows ? ['/c', 'npm run start'] : ['-c', 'npm run start'];

childProcess.spawn(shell, args, {
  cwd: __dirname,
  stdio: 'inherit',
  detached: !isWindows
}).unref();

setTimeout(() => {
  console.log('Acesse: http://localhost:3000/register');
}, 3000);