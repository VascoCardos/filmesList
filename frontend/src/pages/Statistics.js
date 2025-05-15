"use client"

// Página de estatísticas de filmes
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import movieService from "../services/api"

// Cores para os gráficos
const COLORS = [
  "#1976d2",
  "#2196f3",
  "#64b5f6",
  "#90caf9",
  "#bbdefb",
  "#0097a7",
  "#00bcd4",
  "#4dd0e1",
  "#81d4fa",
  "#b3e5fc",
  "#00796b",
  "#009688",
  "#4db6ac",
  "#80cbc4",
  "#b2dfdb",
]

const Statistics = () => {
  // Estados para armazenar dados e estado da UI
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Efeito para carregar estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await movieService.getMovieStats()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err)
        setError("Falha ao carregar estatísticas. Por favor, tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
      </Box>
    )
  }

  // Renderizar mensagem se não houver dados
  if (!stats) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="info">Nenhuma estatística disponível.</Alert>
      </Box>
    )
  }

  // Preparar dados para o gráfico de barras
  const barChartData = stats.porGenero.map((item) => ({
    name: item.genero,
    filmes: item.quantidade,
    avaliacao: item.avaliacaoMedia,
  }))

  // Preparar dados para o gráfico de pizza
  const pieChartData = stats.porGenero.map((item) => ({
    name: item.genero,
    value: item.quantidade,
  }))

  return (
    <Box sx={{ py: 3 }}>
      {/* Título da página */}
      <Typography variant="h4" component="h1" gutterBottom>
        Estatísticas de Filmes
      </Typography>

      {/* Cards com estatísticas gerais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total de Filmes
              </Typography>
              <Typography variant="h3" component="div">
                {stats.geral.totalFilmes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Avaliação Média
              </Typography>
              <Typography variant="h3" component="div">
                {stats.geral.avaliacaoMedia}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                de 10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Filme Mais Antigo
              </Typography>
              <Typography variant="h3" component="div">
                {stats.geral.anoMaisAntigo}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Filme Mais Recente
              </Typography>
              <Typography variant="h3" component="div">
                {stats.geral.anoMaisRecente}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de barras - Quantidade de filmes por gênero */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quantidade de Filmes por Gênero
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="filmes" name="Quantidade de Filmes" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de pizza - Distribuição de filmes por gênero */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição por Gênero
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} filmes`, "Quantidade"]} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de barras - Avaliação média por gênero */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Avaliação Média por Gênero
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avaliacao" name="Avaliação Média (0-10)" fill="#009688" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Tabela de estatísticas por gênero */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas Detalhadas por Gênero
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Gênero</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Avaliação Média</TableCell>
                    <TableCell align="right">Ano Médio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.porGenero.map((row) => (
                    <TableRow key={row.genero}>
                      <TableCell component="th" scope="row">
                        {row.genero}
                      </TableCell>
                      <TableCell align="right">{row.quantidade}</TableCell>
                      <TableCell align="right">{row.avaliacaoMedia}</TableCell>
                      <TableCell align="right">{row.anoMedio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Statistics
