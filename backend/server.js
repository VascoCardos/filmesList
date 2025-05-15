const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const movieRoutes = require("./routes/movieRoutes")
const path = require("path")

// Carregar variáveis de ambiente
dotenv.config()

// Conectar ao banco de dados MongoDB
connectDB()

const app = express()

// Middleware para permitir JSON no corpo das requisições
app.use(express.json())

// Configurar CORS - IMPORTANTE: Esta configuração deve vir ANTES das rotas
app.use(
  cors({
    origin: ["https://movie-frontend-tom2.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
)

// Middleware para adicionar cabeçalhos CORS manualmente (backup)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://movie-frontend-tom2.onrender.com")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Credentials", "true")

  // Responder imediatamente às solicitações OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end()
  }

  next()
})

// Rota de teste CORS
app.get("/api/test-cors", (req, res) => {
  res.json({ message: "CORS está funcionando corretamente!", timestamp: new Date().toISOString() })
})

// Definir rotas da API
app.use("/api/movies", movieRoutes)

// Rota básica para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando! Ambiente: " + process.env.NODE_ENV)
})

// Definir porta e iniciar o servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`)
})
