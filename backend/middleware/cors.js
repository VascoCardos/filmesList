const corsMiddleware = (req, res, next) => {
  // Lista de origens permitidas
  const allowedOrigins = ["https://movie-frontend-tom2.onrender.com", "http://localhost:3000"]

  const origin = req.headers.origin

  // Verificar se a origem da requisição está na lista de origens permitidas
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
  }

  // Configurar outros cabeçalhos CORS
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")

  // Responder imediatamente às solicitações OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(204).end()
  }

  next()
}

module.exports = corsMiddleware
