const { users } = require('./usuariosController');
const { showProfiles } = require('./perfisControllers');
const { showModules } = require('./modulosController');
const { showTransactions } = require('./transacoesController');
const { showFunctions } = require('./funcoesController');

const getUsersData = async (req, res) => {
    try {

        console.log(users)

        let data = {
            'Quantidade de Usuários': users.length,
            'Usuários': users
        };

        // Envie a resposta apenas uma vez
        return res.status(200).json({ success: true, data });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

/*const getDashboardData = async (req, res) => {
    try {
        const { users, usersQuantitaty } = await showUsers(req, res);
        const { profiles, profilesQuantitaty } = await showProfiles(req, res);
        const { modules, modulesQuantitaty } = await showModules(req, res);
        const { transactions, transactionsQuantitaty } = await showTransactions(req, res);
        const { functions, functionsQuantitaty } = await showFunctions(req, res);

        let dataQuantitaty = {
            'Usuários': usersQuantitaty,
            'Perfis': profilesQuantitaty,
            'Módulos': modulesQuantitaty,
            'Transações': transactionsQuantitaty,
            'Funções': functionsQuantitaty
        };

        let data = {
            'Usuários': users,
            'Perfis': profiles,
            'Módulos': modules,
            'Transações': transactions,
            'Funções': functions
        };

        // Envie a resposta apenas uma vez
        return res.status(200).json({ success: true, dataQuantitaty, data });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};*/

module.exports = {

    getUsersData
};
