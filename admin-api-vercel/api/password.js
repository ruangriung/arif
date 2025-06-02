export default async (req, res) => {
  // 1. Atur CORS
  const allowedOrigins = [
    'https://ruangriung.my.id',
    'https://arif-rouge.vercel.app'
    'https://arif.ruangriung.my.id'
    'https://ruangriung.github.io/arif'
  ];
  const origin = req.headers.origin;

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ 
      error: 'CORS Error', 
      detail: `Origin ${origin} not allowed` 
    });
  }

  // 2. Validasi API Key
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Invalid API Key',
      received: apiKey 
    });
  }

  // 3. Response
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');

  return res.json({
    password: process.env.ADMIN_PASSWORD,
    status: 'success',
    timestamp: Date.now()
  });
};
