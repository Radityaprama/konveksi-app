import fetch from 'node-fetch';

const base = 'http://localhost:4000/api';

async function run() {
  try {
    const h = await (await fetch(`${base}/health`)).json();
    console.log('HEALTH:\n', JSON.stringify(h, null, 2));
  } catch (e) {
    console.error('Health request failed:', e.message);
  }

  try {
    const pResp = await fetch(`${base}/products`);
    const pText = await pResp.text();
    try {
      const p = JSON.parse(pText || '[]');
      console.log('\nPRODUCTS:\n', JSON.stringify(p, null, 2));
    } catch (e) {
      console.log('\nPRODUCTS: (non-json response)');
      console.log(pText);
    }
  } catch (e) {
    console.error('Products request failed:', e.message);
  }
}

run();
