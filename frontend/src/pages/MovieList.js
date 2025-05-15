"use client"

// Página de listagem de filmes
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Grid,
  Typography,
  Pagination,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Divider,
  Paper,
} from "@mui/material"
import { FilterAlt, Clear } from "@mui/icons-material"
import MovieCard from "../components/MovieCard"
import movieService from "../services/api"
import ApiDebug from "../components/ApiDebug"

// Função para extrair parâmetros de consulta da URL
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const MovieList = () => {
  // Estados para armazenar dados e estado da UI
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filtros, setFiltros] = useState({
    genero: "",
    ano: "",
    busca: "",
  })

  // Hooks para navegação e parâmetros de URL
  const navigate = useNavigate()
  const query = useQuery()
  const buscaParam = query.get("busca")

  // Efeito para carregar filmes quando a página ou filtros mudam
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)

        // Preparar filtros para a API
        const filtrosAPI = { ...filtros }
        if (buscaParam) {
          filtrosAPI.busca = buscaParam
          setFiltros((prev) => ({ ...prev, busca: buscaParam }))
        }

        // Buscar filmes da API
        const data = await movieService.getMovies(page, 12, filtrosAPI)

        setMovies(data.dados)
        setTotalPages(data.totalPaginas)
        setError(null)
      } catch (err) {
        console.error("Erro ao carregar filmes:", err)
        setError("Falha ao carregar filmes. Por favor, tente novamente mais tarde.")
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [page, buscaParam])

  // Manipulador para mudança de página
  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Manipulador para mudança de filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  // Manipulador para aplicar filtros
  const aplicarFiltros = () => {
    setPage(1)
    navigate(`/?${new URLSearchParams(filtros).toString()}`)
  }

  // Manipulador para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      genero: "",
      ano: "",
      busca: "",
    })
    setPage(1)
    navigate("/")
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Título da página */}
      <Typography variant="h4" component="h1" gutterBottom>
        Catálogo de Filmes
      </Typography>

      {/* Componente de debug - remova em produção quando tudo estiver funcionando */}
      {process.env.NODE_ENV === "development" && <ApiDebug />}

      {/* Seção de filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="genero-label">Gênero</InputLabel>
              <Select
                labelId="genero-label"
                name="genero"
                value={filtros.genero}
                label="Gênero"
                onChange={handleFiltroChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Ação">Ação</MenuItem>
                <MenuItem value="Aventura">Aventura</MenuItem>
                <MenuItem value="Comédia">Comédia</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Ficção Científica">Ficção Científica</MenuItem>
                <MenuItem value="Terror">Terror</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Ano"
              name="ano"
              type="number"
              size="small"
              value={filtros.ano}
              onChange={handleFiltroChange}
              InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Busca"
              name="busca"
              size="small"
              value={filtros.busca}
              onChange={handleFiltroChange}
              placeholder="Título, diretor..."
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" color="primary" onClick={aplicarFiltros} startIcon={<FilterAlt />}>
                Filtrar
              </Button>
              <Button variant="outlined" onClick={limparFiltros} startIcon={<Clear />}>
                Limpar
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Mostrar filtros ativos */}
        {(filtros.genero || filtros.ano || filtros.busca) && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {filtros.genero && (
                <Chip
                  label={`Gênero: ${filtros.genero}`}
                  onDelete={() => setFiltros((prev) => ({ ...prev, genero: "" }))}
                />
              )}
              {filtros.ano && (
                <Chip label={`Ano: ${filtros.ano}`} onDelete={() => setFiltros((prev) => ({ ...prev, ano: "" }))} />
              )}
              {filtros.busca && (
                <Chip
                  label={`Busca: ${filtros.busca}`}
                  onDelete={() => setFiltros((prev) => ({ ...prev, busca: "" }))}
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Exibir mensagem de erro se houver */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Exibir indicador de carregamento */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress className="loading-spinner" />
        </Box>
      ) : (
        <>
          {/* Exibir mensagem se não houver filmes */}
          {movies.length === 0 ? (
            <Alert severity="info">Nenhum filme encontrado com os filtros selecionados.</Alert>
          ) : (
            <>
              {/* Grid de cards de filmes */}
              <Grid container spacing={3}>
                {movies.map((movie) => (
                  <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))}
              </Grid>

              {/* Paginação */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default MovieList
