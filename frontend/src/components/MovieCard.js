"use client"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardMedia, Typography, Button, CardActions, Chip, Box, Rating } from "@mui/material"
import { Movie as MovieIcon } from "@mui/icons-material"

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  // Função para navegar para a página de detalhes do filme
  const handleMovieClick = () => {
    navigate(`/movies/${movie._id}`)
  }

  // URL do poster ou imagem padrão se não houver poster
  const posterUrl = movie.poster || "https://via.placeholder.com/300x450?text=Sem+Poster"

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
      className="movie-card"
    >
      {/* Imagem do filme */}
      <CardMedia component="img" sx={{ height: 300 }} image={posterUrl} alt={movie.titulo} />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Título do filme */}
        <Typography variant="h6" component="div" noWrap title={movie.titulo}>
          {movie.titulo}
        </Typography>

        {/* Ano do filme */}
        <Typography variant="body2" color="text.secondary">
          {movie.ano}
        </Typography>

        {/* Avaliação IMDB se disponível */}
        {movie.imdb && movie.imdb.avaliacao > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Rating
              name="read-only"
              value={movie.imdb.avaliacao / 2} // Converter de escala 0-10 para 0-5
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {movie.imdb.avaliacao.toFixed(1)}
            </Typography>
          </Box>
        )}

        {/* Gêneros do filme (limitado a 3) */}
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {movie.generos &&
            movie.generos
              .slice(0, 3)
              .map((genero, index) => (
                <Chip key={index} label={genero} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
              ))}
        </Box>
      </CardContent>

      {/* Botão para ver detalhes */}
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleMovieClick}
          startIcon={<MovieIcon />}
        >
          Ver Detalhes
        </Button>
      </CardActions>
    </Card>
  )
}

export default MovieCard
