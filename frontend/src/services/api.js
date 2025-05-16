import axios from "axios"

// URL base da API - será diferente em produção e desenvolvimento
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://filmeslist.onrender.com/api" // Em produção, usamos caminho relativo
    : "http://localhost:5000/api" // Em desenvolvimento, usamos URL completa

// Criar instância do axios com URL base da API
const api = axios.create({
  baseURL,
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
})

// Serviço de filmes
const movieService = {
  // Obter todos os filmes (com paginação e filtros opcionais)
  getMovies: async (pagina = 1, limite = 10, filtros = {}) => {
    try {
      // Construir parâmetros de consulta
      const params = {
        pagina,
        limite,
        ...filtros,
      }

      const response = await api.get("/movies", { params })
      return response.data
    } catch (erro) {
      console.error("Erro ao buscar filmes:", erro)
      throw erro
    }
  },

  // Obter um filme específico por ID
  getMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`)
      return response.data
    } catch (erro) {
      console.error(`Erro ao buscar filme com ID ${id}:`, erro)
      throw erro
    }
  },

  // Criar um novo filme
  createMovie: async (filmeData) => {
    try {
      const response = await api.post("/movies", filmeData)
      return response.data
    } catch (erro) {
      console.error("Erro ao criar filme:", erro)
      throw erro
    }
  },

  // Atualizar um filme existente
  updateMovie: async (id, filmeData) => {
    try {
      const response = await api.put(`/movies/${id}`, filmeData)
      return response.data
    } catch (erro) {
      console.error(`Erro ao atualizar filme com ID ${id}:`, erro)
      throw erro
    }
  },

  // Excluir um filme
  deleteMovie: async (id) => {
    try {
      const response = await api.delete(`/movies/${id}`)
      return response.data
    } catch (erro) {
      console.error(`Erro ao excluir filme com ID ${id}:`, erro)
      throw erro
    }
  },

  // Buscar filmes por texto
  searchMovies: async (termo) => {
    try {
      const response = await api.get(`/movies/busca`, {
        params: { termo },
      })
      return response.data
    } catch (erro) {
      console.error("Erro na busca de filmes:", erro)
      throw erro
    }
  },

  // Obter estatísticas de filmes
  getMovieStats: async () => {
    try {
      const response = await api.get("/movies/estatisticas")
      return response.data
    } catch (erro) {
      console.error("Erro ao obter estatísticas:", erro)
      throw erro
    }
  },
}

export default movieService
