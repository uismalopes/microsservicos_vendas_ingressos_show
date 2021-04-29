const express = require('express')
const axios = require('axios').default

const app = express()
app.use(express.json())

const baseConsulta = {}

const funcoes = {
  atualizarConsulta (ingressos) {
    Object.keys(ingressos).forEach((key)=>{
      if(baseConsulta[key]) {
        const current = ingressos[key]
        baseConsulta[key]['ingressos'] = current
      }
    })
  },
  ingressoAtualizado (ingresso) {
    if(baseConsulta[ingresso.id]) {
      baseConsulta[ingresso.id]['ingressos'] = {
        id: ingresso.id,
        descricao: ingresso.descricao,
        quantidade: ingresso.quantidade,
      }
    }
  },
  clienteCriado (cliente) {
    baseConsulta[cliente.id] = {
      ...cliente,
      ingressos: []
    }
  }
}

app.get('/clientes/consulta', (req, res)=>{
  const classificados = {}
  const rest = {}
  for(const key in baseConsulta) {
    baseConsulta[key].idade >= 60 ? classificados[key] = baseConsulta[key] : rest[key] = baseConsulta[key]
  }
  return res.status(200).send({ ...classificados, ...rest })
})

app.post('/eventos', (req, res)=>{
  try {
    funcoes[req.body.tipo](req.body.dados)
  } catch (err) {}
  res.status(200).send(baseConsulta);
})

app.listen(6000, ()=> console.log("Consultas. Porta 6000"))