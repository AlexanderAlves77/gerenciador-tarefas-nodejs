const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const LoginController = require('./controllers/LoginController');
const UsuarioController = require('./controllers/UsuarioController');
const AppConstants = require('./enum/AppConstants');
const MongoDBConnectionHelper = require('./helpers/MongoDBConnectionHelper');

const logger = require('./middlewares/logger');
const jwt = require('./middlewares/jwt');
const TarefaController = require('./controllers/TarefaController');

class App {
  #controllers;

  iniciar() {
    // configurar o express
    this.#configurarExpress();
    // configurar conexão com banco de dados
    this.#configurarBancoDeDados();
    // carregar os controllers
    this.#carregaControllers();
    // iniciar o servidor
    this.#iniciarServidor();
  }

  #configurarExpress() {
    // Cria a instância do express para gerenciar o servidor
    this.express = express();

    // Registra o middleware para fazer o log das requisições
    this.express.use(logger);

    // Registra os middlewares para fazer a conversão das requisições da API
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());

    // Registra o middleware do jwt para fazer validação do acesso as rotas através requisições recebidas.
    this.express.use(jwt);

    // Configura o swagger da aplicação para servir documentação
    this.express.use(
      `${AppConstants.BASE_API_URL}/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile)
    );
  }

  #configurarBancoDeDados() {
    MongoDBConnectionHelper.conectar();
  }

  #carregaControllers() {
    // Atribui para propriedade #controllers a lista de controllers disponiveis da aplicação
    this.#controllers = [
      new LoginController(this.express),
      new UsuarioController(this.express),
      new TarefaController(this.express),
    ];
  }

  #iniciarServidor() {
    // Tenta pegar a porta apartir da váriavel de ambiente EXPRESS_PORT
    // se não tiver definida, vai usar a porta padrão.
    const port = process.env.EXPRESS_PORT || 3001;
    this.express.listen(port, () => {
      console.log(`Aplicação executando na porta ${port}.`);
    });
  }
}

module.exports = App;
//
