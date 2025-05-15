const mongoose = require("mongoose")

// Definição do esquema para a coleção de filmes
const MovieSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "O título do filme é obrigatório"],
  },
  ano: {
    type: Number,
    required: [true, "O ano do filme é obrigatório"],
  },
  poster: {
    type: String,
    default: "https://via.placeholder.com/300x450?text=Sem+Poster",
  },
  sinopse: {
    type: String,
    default: "Sem sinopse disponível",
  },
  generos: {
    type: [String],
    default: [],
  },
  diretor: {
    type: String,
    default: "Desconhecido",
  },
  atores: {
    type: [String],
    default: [],
  },
  imdb: {
    avaliacao: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    votos: {
      type: Number,
      default: 0,
    },
    id: Number,
  },
  dataAdicionado: {
    type: Date,
    default: Date.now,
  },
})

// Exportar o modelo para uso nos controladores
module.exports = mongoose.model("Movie", MovieSchema, "movies")
