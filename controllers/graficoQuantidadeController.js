const Perfil = require("../models/perfis");
const Transacao = require("../models/transacoes")
const Funcao = require("../models/funcoes");
const Usuario = require("../models/usuarios");
const Modulo = require("../models/modulos");

const quantitatyData = async (req, res) => {
    try {
        const usersQuantitaty = await Usuario.count();
        const profilesQuantitaty = await Perfil.count();
        const modulesQuantitaty = await Modulo.count();
        const transactionsQuantitaty = await Transacao.count();
        const functionsQuantitaty = await Funcao.count();

        const data = {
            Usuarios: usersQuantitaty,
            Perfis: profilesQuantitaty,
            Modulos: modulesQuantitaty,
            Transacoes: transactionsQuantitaty,
            Funcoes: functionsQuantitaty
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = quantitatyData;