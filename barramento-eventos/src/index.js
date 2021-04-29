const express = require('express')
const axios = require('axios').default

const app = express()
app.use(express.json())

const eventos = []

app.post('/eventos', async(req, res)=>{
  const evento = req.body
  eventos.push(evento)
  await axios.post('http://localhost:4000/eventos', evento)
  await axios.post('http://localhost:6000/eventos', evento)
  await axios.post('http://localhost:7000/eventos', evento)

  res.status(200).send({
      msg: "ok"
  })
})

app.get('/eventos', (req, res) => {
  res.send(eventos);
})

const PORT = 10000
app.listen(PORT, ()=> console.log(`Servidor de barramento iniciado. http://localhost:${PORT}`))