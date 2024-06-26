const PerfilFuncao = require("../models/perfilFuncao");
const Perfil = require("../models/perfis");
const Transacao = require("../models/transacoes")
const Funcao = require("../models/funcoes");
const { Op } = require('sequelize');


const profileFunctionAssociation = async (req, res) => {
    const associations = req.body; // Recebe a matriz de objetos

    try {
        const createdAssociations = [];

        for (const { id_perfil, id_transacao, id_funcao } of associations) {
            const profile = await Perfil.findByPk(id_perfil);
            const transaction = await Transacao.findByPk(id_transacao);
            const func = await Funcao.findByPk(id_funcao);

            if (!profile || !transaction || !func) {
                return res.status(404).send('Perfil, transação ou função não encontrado.');
            }

            // Cria uma nova instância de PerfilFuncao para a associação atual
            const newAssociation = await PerfilFuncao.create({
                id_perfil: profile.id_perfil,
                id_transacao: transaction.id_transacao,
                id_funcao: func.id_funcao
            });

            createdAssociations.push(newAssociation);
        }

        res.status(200).json({ success: true, message: 'Associações entre perfil, transação e função realizadas com sucesso.', associations: createdAssociations });
    } catch (error) {
        console.error('Erro ao associar:', error);
        res.status(500).send('Erro ao associar perfil.');
    }
};

const deleteProfileFunctionAssociation = async (req, res) => {
    const { id_associacao } = req.params;

    try {
        const associationExists = await PerfilFuncao.findOne({
            where: {
                id_associacao: id_associacao
            }
        });

        if (associationExists === null) {
            return res.status(400).json({ success: false, message: 'Associação não encontrada para o ID informado!' });
        };

        await PerfilFuncao.destroy({ where: { id_associacao: id_associacao } });

        return res.status(200).json({ success: true, message: 'Associação excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).send('Erro ao deletar associação.');
    }
};


const getFunctionAssociations = async (req, res) => {
    try {
        const associations = await PerfilFuncao.findAll();
        return res.status(200).json({ success: true, associations });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = {
    profileFunctionAssociation,
    deleteProfileFunctionAssociation,
    getFunctionAssociations
}