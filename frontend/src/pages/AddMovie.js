"use client"

// Página para adicionar um novo filme
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import movieService from "../services/api"

// Lista de gêneros disponíveis
const generos = [
  "Ação",
  "Aventura",
  "Animação",
  "Biografia",
  "Comédia",
  "Crime",
  "Documentário",
  "Drama",
  "Família",
  "Fantasia",
  "Ficção Científica",
  "História",
  "Terror",
  "Musical",
  "Mistério",
  "Romance",
  "Esporte",
  "Suspense",
  "Guerra",
  "Faroeste",
]

const AddMovie = () => {
  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    ano: new Date().getFullYear(),
    poster: "",
    sinopse: "",
    generos: [],
    diretor: "",
    atores: "",
    imdb: {
      avaliacao: 0,
      votos: 0,
    },
  })

  // Estados para controle da UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  // Manipulador para mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target

    // Lidar com campos aninhados (imdb)
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Manipulador para mudanças em campos de array (gêneros)
  const handleArrayChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      generos: value,
    }))
  }

  // Manipulador para envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Preparar dados para envio
      const movieData = {
        ...formData,
        // Converter string de atores para array
        atores: formData.atores
          .split(",")
          .map((ator) => ator.trim())
          .filter((ator) => ator),
        // Converter valores numéricos
        ano: Number(formData.ano),
        imdb: {
          avaliacao: Number(formData.imdb.avaliacao),
          votos: Number(formData.imdb.votos),
        },
      }

      // Enviar dados para a API
      await movieService.createMovie(movieData)

      setSuccess(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      console.error("Erro ao adicionar filme:", err)
      setError("Falha ao adicionar filme. Por favor, verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Manipulador para voltar à lista de filmes
  const handleBack = () => {
    navigate("/")
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Botão para voltar */}
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 3 }}>
        Voltar para a lista
      </Button>

      {/* Título da página */}
      <Typography variant="h4" component="h1" gutterBottom>
        Adicionar Novo Filme
      </Typography>

      {/* Exibir mensagem de sucesso */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Filme adicionado com sucesso! Redirecionando...
        </Alert>
      )}

      {/* Exibir mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Formulário */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Título do filme */}
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                helperText="Título completo do filme"
              />
            </Grid>

            {/* Ano do filme */}
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Ano"
                name="ano"
                type="number"
                value={formData.ano}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() + 5 } }}
                helperText="Ano de lançamento"
              />
            </Grid>

            {/* URL do poster */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL do Poster"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                helperText="URL da imagem do poster (deixe em branco para usar imagem padrão)"
              />
            </Grid>

            {/* Sinopse */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sinopse"
                name="sinopse"
                value={formData.sinopse}
                onChange={handleChange}
                multiline
                rows={4}
                helperText="Breve descrição do enredo do filme"
              />
            </Grid>

            {/* Gêneros */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="generos-label">Gêneros</InputLabel>
                <Select
                  labelId="generos-label"
                  multiple
                  value={formData.generos}
                  onChange={handleArrayChange}
                  input={<OutlinedInput label="Gêneros" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {generos.map((genero) => (
                    <MenuItem key={genero} value={genero}>
                      {genero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Diretor */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Diretor"
                name="diretor"
                value={formData.diretor}
                onChange={handleChange}
                helperText="Nome do diretor do filme"
              />
            </Grid>

            {/* Atores */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Atores"
                name="atores"
                value={formData.atores}
                onChange={handleChange}
                helperText="Lista de atores separados por vírgula"
              />
            </Grid>

            {/* Avaliação IMDB */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avaliação IMDB"
                name="imdb.avaliacao"
                type="number"
                value={formData.imdb.avaliacao}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                helperText="Avaliação de 0 a 10"
              />
            </Grid>

            {/* Votos IMDB */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Votos IMDB"
                name="imdb.votos"
                type="number"
                value={formData.imdb.votos}
                onChange={handleChange}
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Número de votos"
              />
            </Grid>

            {/* Botões de ação */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Filme"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default AddMovie
