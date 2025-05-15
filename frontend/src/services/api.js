import axios from "axios"

// URL base da API - será diferente em produção e desenvolvimento
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://movie-project-api-tom2.onrender.com/api"
    : "http://localhost:5000/api"

console.log("API URL sendo usada:", API_URL) // Para debug

// Criar instância do axios com URL base da API
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Aumentar timeout para 15 segundos
  headers: {
    "Content-Type": "application/json",
  },
  // Importante: Permitir envio de cookies e credenciais
  withCredentials: true,
})

// Interceptor para adicionar cabeçalhos a cada requisição
api.interceptors.request.use(
  (config) => {
    // Adicionar cabeçalhos para ajudar com CORS
    config.headers["X-Requested-With"] = "XMLHttpRequest"
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error)

    if (error.response) {
      console.error("Dados do erro:", error.response.data)
      console.error("Status do erro:", error.response.status)
      console.error("Cabeçalhos da resposta:", error.response.headers)
    } else if (error.request) {
      console.error("Requisição feita mas sem resposta:", error.request)
    } else {
      console.error("Erro ao configurar requisição:", error.message)
    }

    return Promise.reject(error)
  },
)

// Função para testar a conexão com a API
const testApiConnection = async () => {
  try {
    const response = await api.get("/test-cors")
    console.log("Teste de API bem-sucedido:", response.data)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Teste de API falhou:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Serviço de filmes
const movieService = {
  // Testar conexão com a API
  testConnection: testApiConnection,

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
