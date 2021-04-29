const express = require('express')
const axios = require('axios').default

const app = express()
app.use(express.json())


const baseConsulta = []

const funcoes = {
  clienteCriado: (cliente) => {
    baseConsulta.push(cliente)
  },
  excluirCliente: (cliente) => {
    const index = baseConsulta.findIndex(({ id })=> id === cliente.clienteId)
    if(index !== -1) {
      baseConsulta.splice(index, 1)
    }
  }
}

app.get('/clientes/classificacao', (req, res)=>{
  res.status(200).send(baseConsulta.filter(({ idade })=> idade >= 60));
})

app.post('/eventos', (req, res) => {
  try {
    funcoes[req.body.tipo](req.body.dados)
  } catch (error) {
  }
  res.status(200).send(baseConsulta)
})

const PORT = 7000
app.listen(PORT, ()=> console.log(`Classificação rodado na porta ${PORT}`))