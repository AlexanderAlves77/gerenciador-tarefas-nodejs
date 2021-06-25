const mongoose = require('mongoose');

class MongoDBConnectionHelper {
  // Define um método estático que faz a conexão com o mongodb
  // como o método é estático eu não preciso instanciar o objeto para usar
  static conectar() {
    // Faz efetivamente a conexão com o mongodb
    const conexao = mongoose.connect(process.env.MONGO_DB_STRING_CONEXAO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Quando a conexão for realizada com sucesso, ele vai mostrar a mensagem de sucesso
    mongoose.connection.on('connected', () =>
      console.log('Conectado ao mongodb')
    );

    // Se der algum erro na conexão, ele vai mostrar a mensagem de erro
    mongoose.connection.on('error', e =>
      console.error('Erro ao conectar com o mongodb', e.message)
    );

    return conexao;
  }
}

module.exports = MongoDBConnectionHelper;
//
