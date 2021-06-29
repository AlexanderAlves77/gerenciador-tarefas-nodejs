module.exports = (req, res, next) => {
  // Gera um número aleatório para a requisição e arredonda para devolver um número inteiro.
  const traceId = Math.ceil(Math.random() * 9999999999999);
  const logger = {
    // Exibe mensagens de erro
    error: (mensagem, ...parametrosExtras) => {
      console.error(
        `[ERROR] traceId=${traceId}, msg=${mensagem},`,
        ...parametrosExtras
      );
    },
    // Exibe mensagens de depuração
    debug: (mensagem, ...parametrosExtras) => {
      console.log(
        `[DEBUG] traceId=${traceId}, msg=${mensagem},`,
        ...parametrosExtras
      );
    },
    // Exibe mensagens informativas
    info: (mensagem, ...parametrosExtras) => {
      console.info(
        `[INFO] traceId=${traceId}, msg=${mensagem},`,
        ...parametrosExtras
      );
    },
  };

  logger.info(
    'requisição recebida',
    `url=${req.url}, metodo_http=${req.method}`
  );

  // Cria uma propriedade logger no objeto da requisição e atribui o objeto logger que criamos acima.
  req.logger = logger;
  next();
};
