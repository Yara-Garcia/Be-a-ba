const Perfil = require("../models/perfis");
const Modulo = require("../models/modulos");
const Transacao = require("../models/transacoes");
const Funcao = require('../models/funcoes');
const Usuario = require('../models/usuarios');
const perfilModulo = require('../models/perfilModulo');
const PerfilFuncao = require('../models/perfilFuncao');
const { Op } = require('sequelize');
const PerfilModulo = require("../models/perfilModulo");


const createProfile = async (req, res) => {
    const { nome_perfil, descricao } = req.body;

    try {
        const profileAlreadyExists = await Perfil.findOne({
            where: {
                [Op.or]: [
                    { nome_perfil: nome_perfil }
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo nome no banco de dados
        if (profileAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Este perfil já está cadastrado!' });
        }

        const newProfile = await Perfil.create({ nome_perfil, descricao });

        // Adiciona chave success na resposta JSON
        res.status(201).json({ success: true, profile: newProfile.dataValues });
    } catch (error) {
        console.error('Erro ao criar perfil:', error.message);
        // Adiciona chave success na resposta JSON para casos de erro
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
};

const updateProfile = async (req, res) => {
    const { nome_perfil, descricao } = req.body;
    const { id_perfil } = req.params;

    try {

        const profileExists = await Perfil.findOne({
            where: {
                id_perfil: id_perfil
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (profileExists === null) {
            return res.status(400).json({ success: false, message: 'Perfil não encontrado para o ID informado!' });
        };

        const updatedProfile = await Perfil.update({ nome_perfil, descricao },
            { where: { id_perfil: id_perfil } }
        );

        if (updatedProfile.length === 0) {
            return res.status(400).json('O perfil não foi atualizado');
        }

        return res.status(200).json({ success: true, message: 'O perfil foi atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

const deleteProfile = async (req, res) => {

    const { id_perfil } = req.params;
    try {
        const profileExists = await Perfil.findOne({
            where: {
                id_perfil: id_perfil
            }
        });

        //findeone retorna null se NAO encontrar no banco de dados
        if (profileExists === null) {
            return res.status(400).json({ success: false, message: 'Perfil não encontrado para o ID informado!' });
        };

        const associatedToModule = await PerfilModulo.findOne({
            where: { id_perfil: id_perfil }
        })

        const associatedToFunction = await PerfilFuncao.findOne({
            where: { id_perfil: id_perfil }
        })

        if ((associatedToFunction !== null) || (associatedToModule !== null)) {
            return res.status(400).json({ success: false, message: 'Não foi possível deletar. Perfil está associado à outros atributos.' });
        }
        await Perfil.destroy({ where: { id_perfil: id_perfil } });

        return res.status(200).json({ success: true, message: 'Perfil excluído com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, mensagem: 'Erro interno no servidor' });
    }
}

const getProfileInfos = async (req, res) => {

    const { id_perfil } = req.params;
    try {
        const profile = await Perfil.findOne({
            where: {
                id_perfil: id_perfil
            },
            include: [
                { model: Modulo },
                {
                    model: Transacao,
                    include: [{ model: Funcao }] // Carrega todas as funções associadas a cada transação
                }
            ]
        });

        if (profile === null) {
            return res.status(400).json({ success: false, message: 'Perfil não encontrado para o ID informado!' });
        }

        return res.status(200).json({ success: true, profile });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

const showProfiles = async (req, res) => {
    try {
        const profiles = await Perfil.findAll();

        let profilesQuantitaty = 0;

        profiles.forEach(profile => {
            profilesQuantitaty++;
        })

        return res.status(200).json({ success: true, profiles, profilesQuantitaty });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

const getUsersByProfile = async (req, res) => {
    try {
        // Primeiro, obtemos a contagem de usuários por perfil
        const profileCounts = await Usuario.findAll({
            attributes: [
                'id_perfil',
                [Usuario.sequelize.fn('COUNT', Usuario.sequelize.col('*')), 'total']
            ],
            group: ['id_perfil'],
            raw: true
        });

        // Obtemos os IDs dos perfis para buscar seus nomes
        const profileIds = profileCounts.map(profile => profile.id_perfil);

        // Agora, buscamos os nomes dos perfis usando os IDs
        const profiles = await Perfil.findAll({
            attributes: ['id_perfil', 'nome_perfil'],
            where: {
                id_perfil: profileIds
            }
        });

        // Formatar os dados para o formato desejado
        const data = profiles.map(profile => {
            const count = profileCounts.find(count => count.id_perfil === profile.id_perfil);
            return {
                perfil: profile.nome_perfil,
                quantidade: count ? count.total : 0
            };
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Erro ao buscar perfis com contagem de usuários:', error.message);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
};

module.exports = {
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileInfos,
    showProfiles,
    getUsersByProfile
}