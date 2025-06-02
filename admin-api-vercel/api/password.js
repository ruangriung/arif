export default async (req, res) => {
  // 1. Validasi Origin
  if (req.headers.origin !== "https://ruangriung.my.id") {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  // 2. Validasi API Key
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // 3. Kirim Response
  res.setHeader('Access-Control-Allow-Origin', 'https://ruangriung.my.id');
  return res.json({
    password: process.env.ADMIN_PASSWORD,
    expiresAt: Date.now() + 3600000
  });
};
