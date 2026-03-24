const fs = require('fs');

const dbId = '327feba4-f074-800f-b86a-cd06809abcf1';

async function run() {
  try {
    const res = await fetch('https://api.notion.com/v1/blocks/' + dbId + '/children', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer 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',
        'Notion-Version': '2022-06-28',
      }
    });
    const body = await res.text();
    fs.writeFileSync('api-response.json', body, 'utf8');
  } catch(e) {
    fs.writeFileSync('api-response.json', JSON.stringify({error: e.message}), 'utf8');
  }
}
run();
