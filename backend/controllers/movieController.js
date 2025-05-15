const Movie = require("../models/Movie")

// Obter todos os filmes com paginação
exports.getMovies = async (req, res) => {
  try {
    // Parâmetros de paginação
    const pagina = Number.parseInt(req.query.pagina) || 1
    const limite = Number.parseInt(req.query.limite) || 10
    const pular = (pagina - 1) * limite

    // Parâmetros de filtro
    const filtro = {}
    if (req.query.genero) {
      filtro.generos = req.query.genero
    }
    if (req.query.ano) {
      filtro.ano = req.query.ano
    }

    // Buscar filmes no banco de dados
    const filmes = await Movie.find(filtro)
      .select("titulo ano poster generos imdb.avaliacao")
      .skip(pular)
      .limit(limite)
      .sort({ ano: -1 })

    // Contar total de filmes para calcular páginas
    const total = await Movie.countDocuments(filtro)

    // Retornar resposta com filmes e metadados de paginação
    res.json({
      dados: filmes,
      totalPaginas: Math.ceil(total / limite),
      paginaAtual: pagina,
      totalFilmes: total,
    })
  } catch (erro) {
    console.error("Erro ao buscar filmes:", erro)
    res.status(500).json({ mensagem: "Erro ao buscar filmes", erro: erro.message })
  }
}

// Obter um filme específico por ID
exports.getMovieById = async (req, res) => {
  try {
    const filme = await Movie.findById(req.params.id)

    if (!filme) {
      return res.status(404).json({ mensagem: "Filme não encontrado" })
    }

    res.json(filme)
  } catch (erro) {
    console.error("Erro ao buscar filme:", erro)
    res.status(500).json({ mensagem: "Erro ao buscar filme", erro: erro.message })
  }
}

// Criar um novo filme
exports.createMovie = async (req, res) => {
  try {
    // Verificar se o título já existe
    const filmeExistente = await Movie.findOne({ titulo: req.body.titulo })
    if (filmeExistente) {
      return res.status(400).json({ mensagem: "Filme com este título já existe" })
    }

    // Criar novo filme
    const novoFilme = new Movie(req.body)
    const filmeSalvo = await novoFilme.save()

    res.status(201).json({
      mensagem: "Filme criado com sucesso",
      filme: filmeSalvo,
    })
  } catch (erro) {
    console.error("Erro ao criar filme:", erro)
    res.status(500).json({ mensagem: "Erro ao criar filme", erro: erro.message })
  }
}

// Atualizar um filme existente
exports.updateMovie = async (req, res) => {
  try {
    // Buscar e atualizar o filme
    const filmeAtualizado = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!filmeAtualizado) {
      return res.status(404).json({ mensagem: "Filme não encontrado" })
    }

    res.json({
      mensagem: "Filme atualizado com sucesso",
      filme: filmeAtualizado,
    })
  } catch (erro) {
    console.error("Erro ao atualizar filme:", erro)
    res.status(500).json({ mensagem: "Erro ao atualizar filme", erro: erro.message })
  }
}

// Excluir um filme
exports.deleteMovie = async (req, res) => {
  try {
    const filmeExcluido = await Movie.findByIdAndDelete(req.params.id)

    if (!filmeExcluido) {
      return res.status(404).json({ mensagem: "Filme não encontrado" })
    }

    res.json({
      mensagem: "Filme excluído com sucesso",
      filme: filmeExcluido,
    })
  } catch (erro) {
    console.error("Erro ao excluir filme:", erro)
    res.status(500).json({ mensagem: "Erro ao excluir filme", erro: erro.message })
  }
}

// Buscar filmes por texto (pesquisa de texto completo)
exports.searchMovies = async (req, res) => {
  try {
    const termo = req.query.termo

    if (!termo) {
      return res.status(400).json({ mensagem: "Termo de busca é obrigatório" })
    }

    // Busca por texto em vários campos
    const filmes = await Movie.find({
      $or: [
        { titulo: { $regex: termo, $options: "i" } },
        { sinopse: { $regex: termo, $options: "i" } },
        { diretor: { $regex: termo, $options: "i" } },
        { generos: { $regex: termo, $options: "i" } },
      ],
    }).limit(20)

    res.json({
      resultados: filmes,
      total: filmes.length,
      termo: termo,
    })
  } catch (erro) {
    console.error("Erro na busca de filmes:", erro)
    res.status(500).json({ mensagem: "Erro na busca de filmes", erro: erro.message })
  }
}

// Obter estatísticas de filmes (exemplo de agregação)
exports.getMovieStats = async (req, res) => {
  try {
    // Pipeline de agregação para estatísticas
    const estatisticas = await Movie.aggregate([
      // Agrupar por gênero e contar filmes
      {
        $unwind: "$generos",
      },
      {
        $group: {
          _id: "$generos",
          count: { $sum: 1 },
          avaliacaoMedia: { $avg: "$imdb.avaliacao" },
          anoMedio: { $avg: "$ano" },
        },
      },
      // Ordenar por contagem (decrescente)
      {
        $sort: { count: -1 },
      },
      // Limitar a 10 resultados
      {
        $limit: 10,
      },
      // Renomear campos para melhor legibilidade
      {
        $project: {
          genero: "$_id",
          quantidade: "$count",
          avaliacaoMedia: { $round: ["$avaliacaoMedia", 1] },
          anoMedio: { $round: ["$anoMedio", 0] },
          _id: 0,
        },
      },
    ])

    // Estatísticas gerais
    const estatisticasGerais = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalFilmes: { $sum: 1 },
          avaliacaoMedia: { $avg: "$imdb.avaliacao" },
          anoMaisAntigo: { $min: "$ano" },
          anoMaisRecente: { $max: "$ano" },
          mediaAno: { $avg: "$ano" },
        },
      },
      {
        $project: {
          _id: 0,
          totalFilmes: 1,
          avaliacaoMedia: { $round: ["$avaliacaoMedia", 2] },
          anoMaisAntigo: 1,
          anoMaisRecente: 1,
          mediaAno: { $round: ["$mediaAno", 0] },
        },
      },
    ])

    res.json({
      porGenero: estatisticas,
      geral: estatisticasGerais[0],
    })
  } catch (erro) {
    console.error("Erro ao obter estatísticas:", erro)
    res.status(500).json({ mensagem: "Erro ao obter estatísticas", erro: erro.message })
  }
}
