// Arquivo principal do servidor
const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/db")
const movieRoutes = require("./routes/movieRoutes")

// Carregar variáveis de ambiente
dotenv.config()

// Conectar ao banco de dados MongoDB
connectDB()

const app = express()

// Middleware para permitir JSON no corpo das requisições
app.use(express.json())

// Configurar CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Endereço do frontend
    credentials: true,
  }),
)

// Definir rotas
app.use("/api/movies", movieRoutes)

// Rota básica para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando!")
})

// Definir porta e iniciar o servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
