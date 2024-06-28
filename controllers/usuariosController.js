const Usuario = require("../models/usuarios");
const { hash } = require('bcrypt');
const { Op } = require('sequelize');

const createUser = async (req, res) => {
    const { nome_usuario, email, senha, matricula, id_perfil, tipo_usuario } = req.body;
    try {

        const userAlreadyExists = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { matricula: matricula }
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo email ou matricula no banco de dados
        if (userAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Usuário já está cadastrado!' });
        }

        const encryptedPassword = await hash(senha, 10); //criptografia de senha

        const newUser = await Usuario.create({ nome_usuario, email, senha: encryptedPassword, matricula, id_perfil, tipo_usuario });
        delete newUser.dataValues.senha;

        // Adiciona chave success na resposta JSON
        res.status(201).json({ success: true, user: newUser.dataValues });
    } catch (error) {
        console.error('Erro ao criar usuário:', error.message);
        // Adiciona chave success na resposta JSON para casos de erro
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
};

const updateUser = async (req, res) => {
    const { nome_usuario, email, senha, matricula, id_perfil, tipo_usuario } = req.body;
    const { id_usuario } = req.params;

    try {

        const userAlreadyExists = await Usuario.findOne({
            where: {
                //todas as condições dentro do Op.and devem ser verdadeiras para que o registro seja incluído na consulta.
                [Op.and]: [
                    {
                        [Op.or]: [
                            { email: email },
                            { matricula: matricula }
                        ]
                    },
                    { id_usuario: { [Op.ne]: req.params.id_usuario } } // [Op.ne] (diferente) para que busque usuario diferente do id informado. 
                ]
            }
        });

        //findeone retorna null se NAO encontrar o mesmo email ou matricula no banco de dados
        if (userAlreadyExists !== null) {
            return res.status(400).json({ success: false, message: 'Este usuário já está cadastrado!' });
        }

        const encryptedPassword = await hash(senha, 10);

        const updatedUser = await Usuario.update({ nome_usuario, email, senha: encryptedPassword, matricula, id_perfil, tipo_usuario },
            { where: { id_usuario: id_usuario } }
        ); //neste caso, o usuario so pode atualizar suas proprias informacoes. Caso seja um adm, retirar a condição where.

        if (updatedUser.length === 0) {
            return res.status(400).json('O usuario não foi atualizado');
        }

        return res.status(200).json({ success: true, message: 'Usuario foi atualizado com sucesso.' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

const deleteUser = async (req, res) => {

    const { id_usuario } = req.params;
    try {
        const userExists = await Usuario.findOne({
            where: {
                id_usuario: id_usuario
            }
        });

        //findeone retorna null se NAO encontrar o mesmo email ou matricula no banco de dados
        if (userExists === null) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado para o ID informado!' });
        }

        await Usuario.destroy({ where: { id_usuario: id_usuario } });

        return res.status(200).json({ success: true, message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
};

const getUserInfos = async (req, res) => {

    const { id_usuario } = req.params;
    try {
        const user = await Usuario.findOne({ where: { id_usuario: id_usuario } });

        if (user === null) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado para o ID informado!' });
        }

        return res.status(200).json({ success: true, user });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

const showUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();

        let usersQuantitaty = 0;

        users.forEach(user => {
            usersQuantitaty++;
            delete user.dataValues.senha;
        });

        return res.status(200).json({ success: true, users, usersQuantitaty });
    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({ success: false, mensagem: 'Erro interno do servidor.' });
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserInfos,
    showUsers
}