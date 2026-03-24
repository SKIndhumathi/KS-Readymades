// Vercel Serverless Function — proxies all /notion-api/* requests to api.notion.com
// This replaces the local proxy.conf.json for production deployments.

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reconstruct the Notion API path from the dynamic route segments
  const pathSegments = req.query.path || [];
  const notionPath = '/v1/' + pathSegments.join('/');

  // Forward any query parameters (e.g. ?page_size=...)
  const queryString = new URL(req.url, 'http://localhost').search;
  const notionUrl = `https://api.notion.com${notionPath}${queryString}`;

  try {
    const response = await fetch(notionUrl, {
      method: req.method,
      headers: {
        'Authorization': 'Bearer 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',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Notion proxy error:', error);
    return res.status(500).json({ error: 'Proxy request to Notion failed', details: error.message });
  }
};
