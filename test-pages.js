const http = require('http');

function testPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, content: data.substring(0, 200) });
      });
    }).on('error', reject);
  });
}

async function main() {
  const pages = [
    'http://localhost:3000/',
    'http://localhost:3000/login',
    'http://localhost:3000/register',
    'http://localhost:3000/dashboard'
  ];

  for (const url of pages) {
    try {
      const result = await testPage(url);
      console.log(`${url}: ${result.status}`);
    } catch (e) {
      console.log(`${url}: ERRO - ${e.message}`);
    }
  }
}

main();