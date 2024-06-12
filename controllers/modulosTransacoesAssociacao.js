const Modulo = require("../models/modulos");
const Transacao = require("../models/transacoes");
const { Op } = require('sequelize');


const moduleTransactionAssociation = async (req, res) => {
    const { id_modulo, id_transacao } = req.body;
    try {
        const module = await Modulo.findByPk(id_modulo);
        const transaction = await Transacao.findByPk(id_transacao);
        if (!module || !transaction) {
            return res.status(404).send('Módulo ou transação não encontrado.');
        }
        await transaction.addModulo(module); //o sequelize entende que é o relacionamento definido entre transacoes e modulos
        res.status(200).json({ success: true, message: 'Transação associada com sucesso ao módulo.' });
    } catch (error) {
        console.error('Erro ao associar transação ao módulo:', error);
        res.status(500).send('Erro ao associar transação.');
    }
};

module.exports = moduleTransactionAssociation;