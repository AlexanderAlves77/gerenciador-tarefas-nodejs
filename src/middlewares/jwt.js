const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

// Define a lista de rotas públicas da aplicação
const rotasPublicas = [
  { url: '/api/login', method: 'POST' },
  { url: '/api/docs/*', method: 'GET' },
  { url: '/api/usuario', method: 'POST' },
];

module.exports = (req, res, next) => {
  req.logger.info('verificando permissão de acesso a rota', `rota=${req.url}`);

  // Verifica se a requisição recebida é de alguma rota pública
  const rotaPublica = rotasPublicas.find(rota => {
    const rotaPublicaContemWidcard = rota.url.indexOf('*') !== -1;
    const urlRequisicaoContemParteRotaPublica =
      req.url.indexOf(rota.url.replace('*', '')) !== -1;

    return (
      // os parenteses definem a prioridade de verificação das condições
      // Verifica se a tora da requisição é identica
      ((rota.url === req.url ||
        // ou a rota pública contém um '*' e a rota da requisição possuí como parte da url a rota pública
        (rotaPublicaContemWidcard && urlRequisicaoContemParteRotaPublica)) &&
        rota.metodo === req.method.toUpperCase()) ||
      req.method.toUpperCase() === 'OPTIONS'
    );
  });

  if (rotaPublica) {
    req.logger.info('rota pública, requisição liberada');
    return next();
  }

  const authorization = req.headers.authorization;
  // Verifica se o header de autorização foi informado
  if (!authorization) {
    req.logger.info('acesso negado, sem o header de autorização');

    // http status 401 = acesso negado
    return res.status(401).json({
      status: 401,
      erro: 'acesso negado, você precisa enviar o header authorization',
    });
  }

  // Aqi pega o token de autorização, extraindo a parte do 'Bearer'
  // page o texto do 8 caracter em diante
  const token = authorization.substr(7);
  if (!token) {
    req.logger.info('requisição sem o token de acesso');
    return res.status(401).json({
      status: 401,
      erro: 'acesso negado, o token de acesso não foi informado',
    });
  }

  // Verificar se o token é válido e se foi gerado usando a nossa chave secreta
  jwt.verify(token, process.env.CHAVE_SECRETA_JWT, async (err, decoded) => {
    if (err) {
      req.logger.error('erro ao decodificar o token jwt', `token=${token}`);
      return res.status(401).json({
        status: 401,
        erro: 'acesso negado, problema ao codificar o seu token de autorização',
      });
    }
    req.logger.debug('token jwt decodificado', `idUsuario=${decoded._id}`);

    // TODO: carregar os usuário a partir do banco de dados
    const usuario = await UsuarioRepository.buscarPorId(decoded._id);
    if (!usuario) {
      req.logger.error('usuário não encontrado na base', `id=${decoded._id}`);
      return res.status(401).json({
        status: 401,
        erro: 'acesso negado, usuário não encontrado',
      });
    }

    // atribui a propriedade usuario da requisição, quem é o usuário autenticado
    req.usuario = usuario;
    next();
  });
};
