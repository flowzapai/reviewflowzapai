const fs = require('fs');
const path = require('path');
const https = require('https');

const filePath = path.join(__dirname, 'reviewflow.zip');
const fileContent = fs.readFileSync(filePath);

const appName = 'my-app';
const apiKey = 'cfy_f2ca59375055ca97b1457c73d5c01c8a7f84c1bb0ed5aa578c9508b3531ee501';

const boundary = '----ReviewFlowBoundary' + Date.now();

const body = fileContent.toString('base64');

const postData = JSON.stringify({
  app: appName,
  file: body
});

const options = {
  hostname: 'cloudfy.space',
  path: '/api/v1/deploy',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

console.log('Enviando arquivo para Cloudfy...');
console.log('App:', appName);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Resposta:', data);
  });
});

req.on('error', (e) => console.error('Erro:', e.message));

req.write(postData);
req.end();