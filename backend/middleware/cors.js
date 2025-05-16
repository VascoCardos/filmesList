const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const movieRoutes = require("./routes/movieRoutes") // ajuste o caminho conforme necessário

const app = express()

// Lista de origens permitidas
const allowedOrigins = [
  "https://filmeslist-frontend.onrender.com",
  "http://localhost:3000",
]

// Configuração CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Origem não permitida pelo CORS"))
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
)

// Middleware para JSON
app.use(express.json())

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/filmesdb")
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err))

// Rotas da API
app.use("/api/movies", movieRoutes)

// Rota raiz
app.get("/", (req, res) => {
  res.send("API de Filmes está funcionando!")
})

// Inicializar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
