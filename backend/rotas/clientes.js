const express = require ("express");
const multer = require ("multer");
const router = express.Router();
const Cliente = require ('../models/cliente');

const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jgp',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage({
  //requisição, arquivo extraido e uma funçõa a ser executada, capaz de indicar um erro ou
  //devolver o diretório em que as fotos ficarão
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype]?null: new Error ('Mime Type Invalido');
    callback(e, "backend/imagens")
  },
  filename: (req, file, callback) => {
    const nome = file.originalmente.toLowerCase().split("").join("-");
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback(null, `${nome}-${Date.now()}.${extensao}`);
  }
})

const checkAuth = require ('../middleware/check-auth');

router.post ("", checkAuth, multer({storage: armazenamento}).single('imagem'), (req, res, next) => {
  const imageURL = `${req.protocol}://${req.get('host')}`
  const cliente = new Cliente ({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: `${imagemURL}/imagens${req.file.filename}`
  })
  cliente.save().then (clienteInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      //id: clienteInserido._id
      cliente: {
        id: clienteInserido._id,
        nome: clienteInserido.nome,
        fone: clienteInserido.fone,
        email: clienteInserido.email,
        imagemURL: clienteInserido.imagemURL
      }
    })
  })
});

router.get("", (req, res, next) => {
  console.log (req.query);
  const pageSize = +req.query.pagesize;
  const page = +req.query.page;
  const consulta = Cliente.find();//só executa quando chamamos then
  let clientesEncontrados;
  if (pageSize && page){
    consulta.skip (pageSize * (page - 1)). limit (pageSize);
  }
  consulta.then(documents => {
    clientesEncontrados = documents;
    //devolve uma Promise, tratada com o próximo then
    return Cliente.count();
    }).then ((count) => {
      res.status(200).json({
        mensagem:"Tudo OK",
        clientes: clientesEncontrados,
        //devolvendo o count para o Front
        maxClientes: count
      });
    })
});

router.delete( '/:id', checkAuth, (req, res, next) => {
  console.log ("id: ", req.params.id);
  Cliente.deleteOne ({ _id: req.params.id}).then(( resultado) => {
    console.log (resultado);
    res.status (200).json ({ mensagem: "Cliente removido"})
  });
});

router.put( "/:id", checkAuth, multer({storage: armazenamento}).single('imagem'),(req, res, next) => {
  console.log(req.file);
  let imagemURL = req.body.imagemURL;//tentamos pegar a URL já existente
  if (req.file) { //mas se for um arquivo, montamos uma nova
    const url = req.protocol + "://" + req.get("host");
    imagemURL = url + "/imagens/" + req.file.filename;
  }
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: imagemURL
  });
  Cliente.updateOne({ _id: req.params.id}, cliente).then((resultado) => {
    //console.log( resultado)
  });
  res.status(200).json({mensagem: 'Atualização realizada com sucesso'})
});

router.get('/:id', (req, res, next) => {
  Cliente.findById(req.params.id).then(cli => {
    if (cli) {
      res.status(200).json(cli);
    }
    else
      res.status(404).json({ mensagem: "Cliente não encontrado!"})
  })
});

module.exports = router;
