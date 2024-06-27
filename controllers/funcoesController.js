const Funcao = require("../models/funcoes");
const { Op } = require('sequelize');


const createFunction = async (req, res) => {
    const { nome_funcao, descricao } = req.body;

    try {
        const functionAlreadyExists = await Funcao.findOne({
            where: {
                [Op.or]: [
                    { nome_funcao: nome_funcao }
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo nome no banco de dados
        if (functionAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Este função já está cadastrada!' });
        }

        const newFunction = await Funcao.create({ nome_funcao, descricao });

        // Adiciona chave success na resposta JSON
        res.status(201).json({ success: true, user: newFunction.dataValues });
    } catch (error) {
        console.error('Erro ao criar função:', error.message);
        // Adiciona chave success na resposta JSON para casos de erro
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
};

const updateFunction = async (req, res) => {
    const { nome_funcao, descricao } = req.body;
    const { id_funcao } = req.params;

    try {

        const functionExists = await Funcao.findOne({
            where: {
                id_funcao: id_funcao
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (functionExists === null) {
            return res.status(400).json({ success: false, message: 'Função não encontrada para o ID informado!' });
        };

        const updatedFunction = await Funcao.update({ nome_funcao, descricao },
            { where: { id_funcao: id_funcao } }
        );

        if (updatedFunction.length === 0) {
            return res.status(400).json('A função não foi atualizada.');
        }

        return res.status(200).json({ success: true, message: 'A função foi atualizada com sucesso.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

const deleteFunction = async (req, res) => {

    const { id_funcao } = req.params;
    try {
        const functionExists = await Funcao.findOne({
            where: {
                id_funcao: id_funcao
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (functionExists === null) {
            return res.status(400).json({ success: false, message: 'Função não encontrada para o ID informado!' });
        };

        await Funcao.destroy({ where: { id_funcao: id_funcao } });

        return res.status(200).json({ success: true, message: 'Função excluída com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const getFunctionInfos = async (req, res) => {

    const { id_funcao } = req.params;
    try {
        const functionInfo = await Funcao.findOne({ where: { id_funcao: id_funcao } });

        if (functionInfo === null) {
            return res.status(400).json({ success: false, message: 'Função não encontrada para o ID informado!' });
        }

        return res.status(200).json({ success: true, functionInfo });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

const showFunctions = async (req, res) => {
    try {
        const functions = await Funcao.findAll();

        let functionsQuantitaty = 0;

        functions.forEach(func => {
            functionsQuantitaty++;
        })

        return res.status(200).json({ success: true, functions, functionsQuantitaty });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

module.exports = {
    createFunction,
    updateFunction,
    deleteFunction,
    getFunctionInfos,
    showFunctions
}