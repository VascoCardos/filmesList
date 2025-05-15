"use client"

// Página de detalhes de um filme
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  Divider,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material"
import movieService from "../services/api"

const MovieDetail = () => {
  // Estados para armazenar dados e estado da UI
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

  // Hooks para navegação e parâmetros de URL
  const { id } = useParams()
  const navigate = useNavigate()

  // Efeito para carregar detalhes do filme
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const data = await movieService.getMovieById(id)
        setMovie(data)
        setError(null)
      } catch (err) {
        console.error("Erro ao carregar detalhes do filme:", err)
        setError("Falha ao carregar detalhes do filme. Por favor, tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  // Manipuladores para diálogo de confirmação de exclusão
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // Manipulador para excluir filme
  const handleDeleteMovie = async () => {
    try {
      await movieService.deleteMovie(id)
      navigate("/")
    } catch (err) {
      console.error("Erro ao excluir filme:", err)
      setError("Falha ao excluir filme. Por favor, tente novamente mais tarde.")
      handleCloseDialog()
    }
  }

  // Manipulador para editar filme
  const handleEditMovie = () => {
    navigate(`/edit-movie/${id}`)
  }

  // Manipulador para voltar à lista de filmes
  const handleBack = () => {
    navigate("/")
  }

  // Renderizar indicador de carregamento
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress className="loading-spinner" />
      </Box>
    )
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Voltar para a lista
        </Button>
      </Box>
    )
  }

  // Renderizar mensagem se o filme não for encontrado
  if (!movie) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="warning">Filme não encontrado.</Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Voltar para a lista
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Botão para voltar */}
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
        Voltar para a lista
      </Button>

      {/* Banner do filme com imagem de fundo */}
      <Box
        className="movie-banner"
        sx={{
          backgroundImage: `url(${movie.poster || "https://via.placeholder.com/1200x400?text=Sem+Imagem"})`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box className="movie-banner-content" sx={{ width: "100%" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {movie.titulo}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<CalendarIcon />}
              label={movie.ano}
              variant="filled"
              sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
            />
            {movie.imdb && movie.imdb.avaliacao > 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StarIcon sx={{ color: "#FFD700", mr: 0.5 }} />
                <Typography variant="body1">{movie.imdb.avaliacao.toFixed(1)}/10</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Conteúdo principal */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Coluna da esquerda - Informações do filme */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Sinopse
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.sinopse || "Sem sinopse disponível."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Informações adicionais */}
            <Grid container spacing={2}>
              {/* Diretor */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Diretor:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {movie.diretor || "Não informado"}
                </Typography>
              </Grid>

              {/* Gêneros */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CategoryIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Gêneros:
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, ml: 4 }}>
                  {movie.generos && movie.generos.length > 0 ? (
                    movie.generos.map((genero, index) => <Chip key={index} label={genero} size="small" />)
                  ) : (
                    <Typography variant="body2">Não informados</Typography>
                  )}
                </Box>
              </Grid>

              {/* Atores */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Elenco:
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, ml: 4 }}>
                  {movie.atores && movie.atores.length > 0 ? (
                    movie.atores.map((ator, index) => <Chip key={index} label={ator} size="small" variant="outlined" />)
                  ) : (
                    <Typography variant="body2">Não informados</Typography>
                  )}
                </Box>
              </Grid>

              {/* Avaliação IMDB */}
              {movie.imdb && movie.imdb.avaliacao > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Avaliação IMDB:
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 4 }}>
                    <Rating
                      name="read-only"
                      value={movie.imdb.avaliacao / 2} // Converter de escala 0-10 para 0-5
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {movie.imdb.avaliacao.toFixed(1)}/10 ({movie.imdb.votos} votos)
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Coluna da direita - Ações e poster */}
        <Grid item xs={12} md={4}>
          {/* Ações */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ações
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="contained" color="primary" startIcon={<EditIcon />} fullWidth onClick={handleEditMovie}>
                Editar Filme
              </Button>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} fullWidth onClick={handleOpenDialog}>
                Excluir Filme
              </Button>
            </Box>
          </Paper>

          {/* Poster */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Poster
            </Typography>
            <Box
              component="img"
              src={movie.poster || "https://via.placeholder.com/300x450?text=Sem+Poster"}
              alt={movie.titulo}
              sx={{
                width: "100%",
                borderRadius: 1,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o filme "{movie.titulo}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteMovie} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MovieDetail
