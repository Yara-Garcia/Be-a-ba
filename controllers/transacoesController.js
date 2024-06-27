const Modulo = require("../models/modulos");
const Transacao = require("../models/transacoes");
const ModuloTransacao = require("../models/moduloTransacao");
const { Op } = require('sequelize');


const createTransaction = async (req, res) => {
    const { nome_transacao, descricao } = req.body;

    try {
        const transactionAlreadyExists = await Transacao.findOne({
            where: {
                [Op.or]: [
                    { nome_transacao: nome_transacao }
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo nome no banco de dados
        if (transactionAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Esta transação já está cadastrado!' });
        }

        const newTransaction = await Transacao.create({ nome_transacao, descricao });

        // Adiciona chave success na resposta JSON
        res.status(201).json({ success: true, transaction: newTransaction.dataValues });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
};

const updateTransaction = async (req, res) => {
    const { nome_transacao, descricao } = req.body;
    const { id_transacao } = req.params;

    try {

        const transactionExists = await Transacao.findOne({
            where: {
                id_transacao: id_transacao
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (transactionExists === null) {
            return res.status(400).json({ success: false, message: 'Transação não encontrada para o ID informado!' });
        };

        const updatedTransaction = await Transacao.update({ nome_transacao, descricao },
            { where: { id_transacao: id_transacao } }
        );

        if (updatedTransaction.length === 0) {
            return res.status(400).json('A transação não foi atualizada.');
        }

        return res.status(200).json({ success: true, message: 'A transação foi atualizada com sucesso.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

const deleteTransaction = async (req, res) => {

    const { id_transacao } = req.params;
    try {
        const transactionExists = await Transacao.findOne({
            where: {
                id_transacao: id_transacao
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (transactionExists === null) {
            return res.status(400).json({ success: false, message: 'Transação não encontrada para o ID informado!' });
        };

        await Transacao.destroy({ where: { id_transacao: id_transacao } });

        return res.status(200).json({ success: true, message: 'Transação excluída com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const getTransactionInfos = async (req, res) => {
    const { id_transacao } = req.params;

    try {
        // Buscar informações da transação
        const transaction = await Transacao.findOne({
            where: { id_transacao },
            include: [Modulo] // Incluir os módulos associados
        });

        if (!transaction) {
            return res.status(400).json({ success: false, message: 'Transação não encontrada para o ID informado!' });
        }
        return res.status(200).json({ success: true, transaction });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
}


const showTransactions = async (req, res) => {
    try {
        const transactions = await Transacao.findAll();

        let transactionsQuantitaty = 0;

        transactions.forEach(transaction => {
            transactionsQuantitaty++;
        })

        return res.status(200).json({ success: true, transactions, transactionsQuantitaty });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionInfos,
    showTransactions
}