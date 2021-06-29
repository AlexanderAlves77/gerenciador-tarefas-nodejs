// Faz a definição da interface do repositório de tarefas
// implementação de repositório de tarefas vai precisar ter os métodos definidos aqui
module.exports = Implementacao => {
  if (!Implementacao.cadastrar) {
    throw new Error(
      `A classe ${Implementacao} não implementou o método cadastrar.`
    );
  }

  if (!Implementacao.editar) {
    throw new Error(
      `A classe ${Implementacao} não implementou o método editar.`
    );
  }

  if (!Implementacao.deletar) {
    throw new Error(
      `A classe ${Implementacao} não implementou o método deletar.`
    );
  }

  if (!Implementacao.filtrarPorUsuarioPeriodoEStatus) {
    throw new Error(
      `A classe ${Implementacao} não implementou o método filtrarPorUsuarioPeriodoEStatus.`
    );
  }

  if (!Implementacao.buscarPorId) {
    throw new Error(
      `A classe ${Implementacao} não implementou o método buscarPorId.`
    );
  }

  return Implementacao;
};
