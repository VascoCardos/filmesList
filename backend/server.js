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

// Configurar CORS para permitir requisições do frontend
app.use(
  cors({
    // Em produção, isso será substituído pelo domínio do seu frontend no Render
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "https://seu-app-frontend.onrender.com"
        : "http://localhost:3000",
    credentials: true,
  }),
)

// Definir rotas da API
app.use("/api/movies", movieRoutes)

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === "production") {
  // Pasta onde o frontend será construído
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  // Qualquer rota não definida acima será redirecionada para o frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  })
} else {
  // Rota básica para verificar se o servidor está funcionando
  app.get("/", (req, res) => {
    res.send("API está funcionando! Ambiente: Desenvolvimento")
  })
}

// Definir porta e iniciar o servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`)
})
