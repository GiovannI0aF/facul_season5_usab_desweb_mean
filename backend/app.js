const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const clienteRoutes = require ('./rotas/clientes');

mongoose.connect('mongodb+srv://userteste:usjt0123@cluster0.pgprl.mongodb.net/app-mean?retryWrites=true&w=majority').then (() => {
  console.log("Conexão OK")
}).catch ((e) => {
  console.log("Conexão NOK" + e)
});
app.use (bodyParser.json());

const clientes =[
  {
    id:'1',
    nome:'José',
    fone:'11223344',
    email:'jose@email.com'
  },
  {
    id:'2',
    nome:'Jaqueline',
    fone:'22112211',
    email:'jaqueline@email.com'
  }
]

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  next();
});



app.use('/api/clientes',clienteRoutes);




module.exports = app;
