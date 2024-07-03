const PerfilFuncao = require('../models/perfilFuncao');
const PerfilModulo = require('../models/perfilModulo');
const Perfil = require('../models/perfis');
const Transacao = require('../models/transacoes');
const Funcao = require('../models/funcoes');
const Modulo = require('../models/modulos');

// Rota para obter as associações de perfil, transação e função
const perfilFuncaoRelatorioComNomes = async (req, res) => {
    const idPerfil = req.usuario.id_perfil;

    try {
        // Busca as associações de perfil, transação e função para o id_perfil especificado
        const perfilFuncoes = await PerfilFuncao.findAll({
            where: { id_perfil: idPerfil }
        });

        // Arrays para armazenar as promessas das consultas aos nomes
        const perfilPromises = [];
        const transacaoPromises = [];
        const funcaoPromises = [];

        perfilFuncoes.forEach(pf => {
            // Cria as promessas para buscar os nomes de perfil, transação e função
            perfilPromises.push(
                Perfil.findByPk(pf.id_perfil)
                    .then(perfil => perfil.nome_perfil)
            );


            transacaoPromises.push(
                Transacao.findByPk(pf.id_transacao)
                    .then(transacao => transacao.nome_transacao)
            );

            funcaoPromises.push(
                Funcao.findByPk(pf.id_funcao)
                    .then(funcao => funcao.nome_funcao)
            );
        });

        // Espera que todas as promessas sejam resolvidas
        const nomesPerfil = await Promise.all(perfilPromises);
        const nomesTransacao = await Promise.all(transacaoPromises);
        const nomesFuncao = await Promise.all(funcaoPromises);

        // Formata os resultados como um objeto JSON
        const resultados = perfilFuncoes.map((pf, index) => ({
            id_associacao: pf.id_associacao,
            nome_perfil: nomesPerfil[index],
            nome_transacao: nomesTransacao[index],
            nome_funcao: nomesFuncao[index]
        }));

        res.json(resultados);
    } catch (error) {
        console.error('Erro ao buscar associações de perfil, transação e função:', error);
        res.status(500).json({ message: 'Erro ao buscar associações de perfil, transação e função' });
    }
};


const perfilModuloRelatorioComNomes = async (req, res) => {
    const idPerfil = req.usuario.id_perfil;

    try {
        const perfilModulos = await PerfilModulo.findAll({
            where: { id_perfil: idPerfil }
        });

        const perfilPromises = [];
        const moduloPromises = [];


        perfilModulos.forEach(pm => {
            perfilPromises.push(
                Perfil.findByPk(pm.id_perfil)
                    .then(perfil => perfil.nome_perfil)
            );

            moduloPromises.push(
                Modulo.findByPk(pm.id_modulo)
                    .then(modulo => modulo.nome_modulo)
            );

        });

        // Espera que todas as promessas sejam resolvidas
        const nomesPerfil = await Promise.all(perfilPromises);
        const nomesModulo = await Promise.all(moduloPromises);

        // Formata os resultados como um objeto JSON
        const resultados = perfilModulos.map((pm, index) => ({
            id_associacao: pm.id_associacao,
            nome_perfil: nomesPerfil[index],
            nome_modulo: nomesModulo[index]
        }));

        res.json(resultados);
    } catch (error) {
        console.error('Erro ao buscar associações de perfil e módulos:', error);
        res.status(500).json({ message: 'Erro ao buscar associações de perfil e módulos' });
    }
};


module.exports = {
    perfilFuncaoRelatorioComNomes,
    perfilModuloRelatorioComNomes
}
