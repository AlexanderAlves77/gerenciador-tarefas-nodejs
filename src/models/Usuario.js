const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

const mensagemErroObrigatorio = '*Campo obrigatório!';
const UsuarioSchema = new Schema({
  nome: {
    type: String,
    required: [true, mensagemErroObrigatorio],
  },
  email: {
    type: String,
    required: [true, mensagemErroObrigatorio],
  },
  senha: {
    type: String,
    required: [true, mensagemErroObrigatorio],
  },
});

// Define um evento que é executado antes do usuário ser salvo no banco
UsuarioSchema.pre('save', function (next) {
  // Criptografa a senha do usuário para não ficar exposta no banco
  this.senha = md5(this.senha);
  next();
});

// Faz o link do schema com a collection (leia tabela) 'usuarios'
const Usuario = mongoose.model('usuarios', UsuarioSchema);
module.exports = Usuario;
