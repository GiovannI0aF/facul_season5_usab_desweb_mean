const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  //split quebra a string em 2, usando espacço como separador
  //ou seja, gera um vetor em que a primeira posição
  //contém a palavra Bearer e a segunda contém o token desejado
  try {
    const toke = req.headers.authorization.split("")[1];
    jwt.verify(token, "minhasenha");
    next()
  }
  //se não existir o header authorization, tratamos o erro
  catch (err) {
    res.status(401).json ({
      mensagem: "Autenticação falhou"
    })
  }
}
