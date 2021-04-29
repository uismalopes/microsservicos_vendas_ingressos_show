const express = require('express')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios').default

const app = express()

app.use(express.json())

const BD_CLIENTES = {}

app.get('/clientes', (req, res)=>{
  res.send(BD_CLIENTES)
})

app.post('/clientes', async (req, res)=>{
  const id = uuidv4()
  const { nome, endereco, idade } = req.body
  BD_CLIENTES[id] = {
    id,
    nome,
    endereco,
    idade
  }
  await axios.post('http://localhost:10000/eventos', {
    tipo: 'clienteCriado',
    dados: {
      id,
      nome,
      endereco,
      idade,
      status: 'criado'
    }
  })
  res.status(201).send(BD_CLIENTES[id])
})

app.delete('/clientes/:id', async (req, res)=>{
  const { id } = req.params
  await axios.post(`http://localhost:10000/eventos`, {
    tipo: 'excluirIngresso',
    dados: {
      clienteId: id
    }
  })
  await axios.post(`http://localhost:10000/eventos`, {
    tipo: 'excluirCliente',
    dados: {
      clienteId: id
    }
  })
  delete BD_CLIENTES[id]
  res.status(200).send({ msg: 'ok' })
})

app.put('/clientes/:id', (req, res)=>{
  const { id } = req.params
  if(BD_CLIENTES[id]) {
    BD_CLIENTES[id] = { ...BD_CLIENTES[id], ...req.body}
  }
  res.status(200).send(BD_CLIENTES[id])
})

const PORT = 3000

app.listen(PORT, ()=> console.log(`Servidor de cliente iniciado. http://localhost:${PORT}`))