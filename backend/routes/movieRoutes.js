// Rotas para a API de filmes
const express = require("express")
const router = express.Router()
const movieController = require("../controllers/movieController")

// Rota para buscar todos os filmes (com paginação)
router.get("/", movieController.getMovies)

// Rota para buscar filmes por texto
router.get("/busca", movieController.searchMovies)

// Rota para obter estatísticas de filmes
router.get("/estatisticas", movieController.getMovieStats)

// Rota para buscar um filme específico por ID
router.get("/:id", movieController.getMovieById)

// Rota para criar um novo filme
router.post("/", movieController.createMovie)

// Rota para atualizar um filme existente
router.put("/:id", movieController.updateMovie)

// Rota para excluir um filme
router.delete("/:id", movieController.deleteMovie)

module.exports = router
