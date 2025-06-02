export default async (req, res) => {
  // Validasi CORS
  const allowedOrigins = [
    'https://ruangriung.my.id',
    'https://arif-rouge.vercel.app' // Tambahkan domain Vercel sendiri
  ];
  
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ 
      error: `Origin ${origin} not allowed`,
      allowedOrigins // Debugging
    });
  }

  // Validasi API Key
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: "Invalid API key",
      receivedKey: req.headers['x-api-key'] // Debugging
    });
  }

  // Response
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  return res.json({
    password: process.env.ADMIN_PASSWORD,
    expiresAt: Date.now() + 3600000,
    status: 'success'
  });
};
