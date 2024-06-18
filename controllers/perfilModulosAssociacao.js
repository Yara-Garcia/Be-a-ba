const PerfilModulo = require("../models/perfilModulo");
const Modulo = require("../models/modulos");
const Perfil = require("../models/perfis");
const { Op } = require('sequelize');


const profileModuleAssociation = async (req, res) => {
    const associations = req.body; // Recebe a matriz de objetos

    try {
        for (const { id_perfil, id_modulo } of associations) {
            const module = await Modulo.findByPk(id_modulo);
            const profile = await Perfil.findByPk(id_perfil);
            if (!module || !profile) {
                return res.status(404).send('Perfil ou módulo não encontrado.');
            }
            await profile.addModulo(module);//o sequelize entende que é o relacionamento definido entre transacoes e modulos
        }
        res.status(200).json({ success: true, message: 'Módulos associados com sucesso ao perfil.' });
    } catch (error) {
        console.error('Erro ao associar módulo ao perfil:', error);
        res.status(500).send('Erro ao associar módulo ao perfil.');
    }
};

const deleteProfileModuleAssociation = async (req, res) => {
    const { id_associacao } = req.params;

    try {
        const associationExists = await PerfilModulo.findOne({
            where: {
                id_associacao: id_associacao
            }
        });

        if (associationExists === null) {
            return res.status(400).json({ success: false, message: 'Associação não encontrada para o ID informado!' });
        };

        await PerfilModulo.destroy({ where: { id_associacao: id_associacao } });

        return res.status(200).json({ success: true, message: 'Associação excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar associação:', error);
        res.status(500).send('Erro ao deletar associação.');
    }
};



const getProfileModuleAssociations = async (Req, res) => {
    try {
        const associations = await PerfilModulo.findAll();
        return res.status(200).json({ success: true, associations });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};


module.exports = {
    profileModuleAssociation,
    deleteProfileModuleAssociation,
    getProfileModuleAssociations
}