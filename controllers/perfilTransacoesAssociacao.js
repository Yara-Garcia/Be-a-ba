/*const PerfilTransacao = require("../models/perfilTransacao");
const Transacao = require("../models/transacoes");
const Perfil = require("../models/perfis");
const { Op } = require('sequelize');


const profileTransactionAssociation = async (req, res) => {
    const associations = req.body;

    try {
        for (const { id_perfil, id_transacao } of associations) {
            const transaction = await Transacao.findByPk(id_transacao);
            const profile = await Perfil.findByPk(id_perfil);
            if (!transaction || !profile) {
                return res.status(404).send('Perfil ou transação não encontrado.');
            }
            await profile.addTransacao(transaction);
        }
        res.status(200).json({ success: true, message: 'Módulos associados com sucesso ao perfil.' });
    } catch (error) {
        console.error('Erro ao associar transação ao perfil:', error);
        res.status(500).send('Erro ao associar transação ao perfil.');
    }
};

const deleteProfileTransactionAssociation = async (req, res) => {
    const { id_associacao } = req.params;

    try {
        const associationExists = await PerfilTransacao.findOne({
            where: {
                id_associacao: id_associacao
            }
        });

        if (associationExists === null) {
            return res.status(400).json({ success: false, message: 'Associação não encontrada para o ID informado!' });
        };

        await PerfilTransacao.destroy({ where: { id_associacao: id_associacao } });

        return res.status(200).json({ success: true, message: 'Associação excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).send('Erro ao deletar associação.');
    }
};

const getProfileTransactionAssociations = async (Req, res) => {
    try {
        const associations = await PerfilTransacao.findAll();
        return res.status(200).json({ success: true, associations });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = {
    profileTransactionAssociation,
    deleteProfileTransactionAssociation,
    getProfileTransactionAssociations
}*/