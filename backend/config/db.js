const mongoose = require("mongoose")

// Função assíncrona para conectar ao MongoDB
const connectDB = async () => {
  try {
    // Conectar ao MongoDB usando a string de conexão fornecida
    const conn = await mongoose.connect(
      "mongodb+srv://vascoc:vascoc@cluster0.wkllmaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    )

    console.log("MongoDB Conectado com sucesso!")
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB: " + error.message)
    process.exit(1) // Encerrar o processo em caso de erro
  }
}

module.exports = connectDB
