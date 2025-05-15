import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

// Importar componentes e páginas
import Navbar from "./components/Navbar"
import MovieList from "./pages/MovieList"
import MovieDetail from "./pages/MovieDetail"
import AddMovie from "./pages/AddMovie"
import EditMovie from "./pages/EditMovie"
import Statistics from "./pages/Statistics"
import ApiDebug from "./components/ApiDebug"

// Criar tema para Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar aparece em todas as páginas */}
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Componente de diagnóstico - visível em todas as páginas */}
          <ApiDebug />

          <Routes>
            {/* Rota principal - lista de filmes */}
            <Route path="/" element={<MovieList />} />

            {/* Rota para detalhes de um filme específico */}
            <Route path="/movies/:id" element={<MovieDetail />} />

            {/* Rota para adicionar um novo filme */}
            <Route path="/add-movie" element={<AddMovie />} />

            {/* Rota para editar um filme existente */}
            <Route path="/edit-movie/:id" element={<EditMovie />} />

            {/* Rota para visualizar estatísticas */}
            <Route path="/statistics" element={<Statistics />} />
          </Routes>

          {/* Rodapé com informações de debug */}
          <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #e0e0e0", textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Ambiente: {process.env.NODE_ENV} | API:{" "}
              {process.env.NODE_ENV === "production"
                ? "https://movie-project-api-tom2.onrender.com/api"
                : "http://localhost:5000/api"}
            </Typography>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
