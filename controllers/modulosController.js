const Modulo = require("../models/modulos");
const { Op } = require('sequelize');


const createModule = async (req, res) => {
    const { nome_modulo, descricao } = req.body;

    try {
        const moduleAlreadyExists = await Modulo.findOne({
            where: {
                [Op.or]: [
                    { nome_modulo: nome_modulo }
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo nome no banco de dados
        if (moduleAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Este módulo já está cadastrado!' });
        }

        const newModule = await Modulo.create({ nome_modulo, descricao });

        // Adiciona chave success na resposta JSON
        res.status(201).json({ success: true, user: newModule.dataValues });
    } catch (error) {
        console.error('Erro ao criar módulo:', error.message);
        // Adiciona chave success na resposta JSON para casos de erro
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });

    }
};

const updateModule = async (req, res) => {
    const { nome_modulo, descricao } = req.body;
    const { id_modulo } = req.params;

    try {

        const moduleExists = await Modulo.findOne({
            where: {
                id_modulo: id_modulo
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (moduleExists === null) {
            return res.status(400).json({ success: false, message: 'Módulo não encontrado para o ID informado!' });
        };

        const updatedModule = await Modulo.update({ nome_modulo, descricao },
            { where: { id_modulo: id_modulo } }
        );

        if (updatedModule.length === 0) {
            return res.status(400).json('O módulo não foi atualizado');
        }

        return res.status(200).json({ success: true, message: 'O Módulo foi atualizado com sucesso.' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

const deleteModule = async (req, res) => {

    const { id_modulo } = req.params;
    try {
        const moduleExists = await Modulo.findOne({
            where: {
                id_modulo: id_modulo
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (moduleExists === null) {
            return res.status(400).json({ success: false, message: 'Módulo não encontrado para o ID informado!' });
        };

        await Modulo.destroy({ where: { id_modulo: id_modulo } });

        return res.status(200).json({ success: true, message: 'Módulo excluído com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    createModule,
    updateModule,
    deleteModule
}