const express = require('express')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios').default

const app = express()
app.use(express.json())

const BD_INGRESSOS_POR_ID = {}

const funcoes = {
  ingressoCriado: (ingresso)=>{
    const ingressos = BD_INGRESSOS_POR_ID[ingresso.clienteId]
    const ingressosParaAtualizar = ingressos.find((i) => i.id === ingresso.id)
    ingressosParaAtualizar.status = ingresso.status
    axios.post('http://localhost:10000/eventos', {
      tipo: 'ingressoAtualizado',
      dados: {
        id: ingresso.id,
        descricao: ingresso.descricao,
        clienteId: ingresso.clienteId,
        quantidade: ingresso.quantidade,
        status: ingresso.status
      }
    })
  },
  excluirIngresso: (cliente) => {
    const id = cliente.clienteId
    delete BD_INGRESSOS_POR_ID[id]
  }
}

app.post('/clientes/:id/ingressos', async (req, res)=> {
  const id = uuidv4()
  const {descricao, quantidade} = req.body
  let ingressosDoCliente = BD_INGRESSOS_POR_ID[req.params.id] || [];
  ingressosDoCliente = [{
    id,
    descricao,
    quantidade,
    status: 'aguardando'
  }]
  BD_INGRESSOS_POR_ID[req.params.id] = ingressosDoCliente

  await axios.post('http://localhost:10000/eventos', {
    tipo: 'ingressoCriado',
    dados: {
      id,
      descricao,
      quantidade,
      clienteId: req.params.id,
      status: 'aguardando'
    }
  })
  await axios.post('http://localhost:10000/eventos', {
    tipo: 'atualizarConsulta',
    dados: {
      ...BD_INGRESSOS_POR_ID
    }
  })
  res.status(201).send(ingressosDoCliente)
})

app.get('/clientes/:id/ingressos', (req, res)=>{
  res.send(BD_INGRESSOS_POR_ID[req.params.id] || [])
})

app.put('/clientes/:id/ingressos', (req, res)=>{
  BD_INGRESSOS_POR_ID[req.params.id] = [{...BD_INGRESSOS_POR_ID[req.params.id][0], ...req.body}]
  BD_INGRESSOS_POR_ID[req.params.id][0].status = 'atualizado'
  axios.post('http://localhost:10000/eventos', {
    tipo: 'ingressoAtualizado',
    dados: {
      ...BD_INGRESSOS_POR_ID[req.params.id][0]
    }
  })
  res.send(BD_INGRESSOS_POR_ID[req.params.id] || [])
})


app.get('/ingressos', (req, res)=>{
  res.status(200).send(BD_INGRESSOS_POR_ID)
})

app.delete('/ingressos/:id', (req, res)=>{
  const { id } = req.params
  Object.keys(BD_INGRESSOS_POR_ID).forEach((clienteId) => {
    if(BD_INGRESSOS_POR_ID[clienteId][0].id === id) {
      delete BD_INGRESSOS_POR_ID[clienteId]
    }
  })
  res.status(200).send({ msg: 'Excluído'})
})

app.post("/eventos", (req, res) => {
  try {
    funcoes[req.body.tipo](req.body.dados);
  } catch (e) {}
  res.status(200).send({ msg: "ok" });
})

const PORT = 4000
app.listen(PORT, ()=> console.log(`Servidor de ingressos iniciado. http://localhost:${PORT}`))