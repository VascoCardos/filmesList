"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Paper, Button, CircularProgress, Divider, Alert } from "@mui/material"
import movieService from "../services/api"

const ApiDebug = () => {
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [autoTest, setAutoTest] = useState(true)

  // URL da API
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://filmeslist.onrender.com/api"
      : "http://localhost:5000/api"

  // Testar automaticamente na montagem do componente
  useEffect(() => {
    if (autoTest) {
      testApi()
      setAutoTest(false)
    }
  }, [autoTest])

  const testApi = async () => {
    setLoading(true)
    setError(null)

    try {
      // Testar endpoint de CORS
      const result = await movieService.testConnection()

      setApiStatus({
        success: result.success,
        data: result.data,
        timestamp: new Date().toISOString(),
      })

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Erro ao testar API:", err)
      setApiStatus({
        success: false,
        timestamp: new Date().toISOString(),
      })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 2, mb: 3, bgcolor: "#f8f9fa", border: "1px solid #e9ecef" }}>
      <Typography variant="h6" gutterBottom>
        Diagnóstico de Conexão com API
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" component="div">
          <strong>Ambiente:</strong> {process.env.NODE_ENV}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>URL da API:</strong> {apiUrl}
        </Typography>
        <Typography variant="body2" component="div">
          <strong>Frontend URL:</strong> {window.location.origin}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Button variant="contained" onClick={testApi} disabled={loading} sx={{ mb: 2 }}>
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Testando...
          </>
        ) : (
          "Testar Conexão com API"
        )}
      </Button>

      {apiStatus && (
        <Box sx={{ mt: 2 }}>
          <Alert severity={apiStatus.success ? "success" : "error"} sx={{ mb: 2 }}>
            {apiStatus.success ? "Conexão com a API estabelecida com sucesso!" : "Falha na conexão com a API"}
          </Alert>

          <Typography variant="body2" component="div">
            <strong>Timestamp:</strong> {apiStatus.timestamp}
          </Typography>

          {apiStatus.success && apiStatus.data && (
            <Box sx={{ mt: 1, p: 1, bgcolor: "#f0f0f0", borderRadius: 1, overflowX: "auto" }}>
              <pre style={{ margin: 0 }}>{JSON.stringify(apiStatus.data, null, 2)}</pre>
            </Box>
          )}

          {error && (
            <Box sx={{ mt: 1, p: 1, bgcolor: "#fff0f0", borderRadius: 1, overflowX: "auto" }}>
              <Typography variant="body2" color="error" component="div">
                <strong>Erro:</strong> {error}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ mt: 2, fontSize: "0.8rem", color: "#6c757d" }}>
        <Typography variant="caption">
          Dica: Se estiver enfrentando problemas de CORS, verifique se o backend está configurado para aceitar
          requisições de {window.location.origin}
        </Typography>
      </Box>
    </Paper>
  )
}

export default ApiDebug
