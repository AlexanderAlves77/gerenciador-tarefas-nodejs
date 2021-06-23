const Tarefa = require('../../models/Tarefa');
const TarefaRepository = require('../TarefaRepository');
const StatusTarefa = require('../../enum/StatusTarefa');
const { CONCLUIDO } = require('../../enum/StatusTarefa');

const transformarTarefa = tarefaBD => {
  return {
    id: tarefaBD._doc._id,
    nome: tarefaBD._doc.nome,
    dataPrevistaConclusao: tarefaBD._doc.dataPrevistaConclusao,
    dataConclusao: tarefaBD._doc.dataConclusao,
    idUsuario: tarefaBD._doc.idUsuario,
  };
};

class MongoDBTarefaRepository {
  static cadastrar(dados) {
    return Tarefa.create(dados);
  }

  static editar(id, dados) {
    return Tarefa.findByIdAndUpdate(id, dados);
  }

  static deletar(id) {
    return Tarefa.findByIdAndDelete(id);
  }

  static async filtrarPorUsuarioPeriodoEStatus({
    peridoDe,
    periodoAte,
    status,
    idUsuario,
  }) {
    const query = { idUsuario };

    if (periodoDe && periodoDe.trim()) {
      // Converte a string passada no parametro no peridoDe para uma data do JS
      const dataPeriodoDe = new Date(periodoDe);
      query.dataPrevistaConclusao = {
        // $get é o mesmo que >=
        $gte: dataPeriodoDe,
      };
    }

    if (periodoAte && periodoAte.trim()) {
      // Converte a string passada como parametro no peridoAte para uma data do JS
      const dataPeriodoAte = new Date(periodoAte);
      if (!query.dataPrevistaConclusao) {
        query.dataPrevistaConclusao = {};
      }
      // Aplica filtro <= dataPeriodoAte
      query.dataPrevistaConclusao.$lte = dataPeriodoAte;
    }

    if (status && status.trim()) {
      const statusInt = parseInt(status);
      if (statusInt === StatusTarefa.EM_ABERTO) {
        query.dataConclusao = null;
      } else if ((statusInt === StatusTarefa) === CONCLUIDO) {
        // Diz para o filtro pegar todas as tarefas com dataConclusao != null
        query.dataConclusao = {
          $ne: null,
        };
      }
    }

    const tarefas = await Tarefa.find(query);

    if (tarefas) {
      // Faz a rtansformação da lisa de tarefas para o modelo esperado na aplicação
      return tarefas.map(t => transformarTarefa(t));
    }

    return [];
  }

  //
  static async buscarPorId(idTarefa) {
    const tarefaBD = await Tarefa.findById(idTarefa);
    if (tarefaBD) {
      return transformarTarefa(tarefaBD);
    }

    return null;
  }
}

module.exports = TarefaRepository(MongoDBTarefaRepository);
