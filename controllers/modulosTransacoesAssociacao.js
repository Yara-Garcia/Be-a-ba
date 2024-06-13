const ModuloTransacao = require("../models/moduloTransacao");
const Modulo = require("../models/modulos");
const Transacao = require("../models/transacoes");
const { Op } = require('sequelize');


const moduleTransactionAssociation = async (req, res) => {
    const associations = req.body; // Recebe a matriz de objetos

    try {
        for (const { id_modulo, id_transacao } of associations) {
            const module = await Modulo.findByPk(id_modulo);
            const transaction = await Transacao.findByPk(id_transacao);
            if (!module || !transaction) {
                return res.status(404).send('Módulo ou transação não encontrado.');
            }
            await transaction.addModulo(module);//o sequelize entende que é o relacionamento definido entre transacoes e modulos
        }
        res.status(200).json({ success: true, message: 'Transações associadas com sucesso aos módulos.' });
    } catch (error) {
        console.error('Erro ao associar transação ao módulo:', error);
        res.status(500).send('Erro ao associar transação.');
    }
};

const deleteModuleTransactionAssociation = async (req, res) => {
    const { id_associacao } = req.body;
    try {
        const associationExists = await ModuloTransacao.findOne({
            where: {
                id_associacao: id_associacao
            }
        });

        if (associationExists === null) {
            return res.status(400).json({ success: false, message: 'Associação não encontrada para o ID informado!' });
        };

        await ModuloTransacao.destroy({ where: { id_associacao: id_associacao } });

        return res.status(200).json({ success: true, message: 'Associação excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao associar transação ao módulo:', error);
        res.status(500).send('Erro ao associar transação.');
    }
};


const showAssociations = async (Req, res) => {
    try {
        const associations = await ModuloTransacao.findAll();
        return res.status(200).json({ success: true, associations });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = {
    moduleTransactionAssociation,
    deleteModuleTransactionAssociation,
    showAssociations
}