const bcrypt = require('bcrypt');
const Usuario = require("../models/usuarios");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const senhaJWT = require('../senhaJWT');

const login = async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const user = await Usuario.findAll({
            where: {
                [Op.or]: [ // Utilize o operador `Op.or` do Sequelize para buscar por email ou matricula
                    { email: usuario },
                    { matricula: usuario }
                ]
            }
        }); //{ email: email } - estamos dizendo ao Sequelize para procurar registros na tabela Usuario onde o valor da coluna email seja igual ao valor da variável email extraída de req.body.

        if (user.length === 0) {
            return res.status(400).json({ success: false, message: 'Email ou senha inválida!' });
        }

        const { senha: encryptedPassword, ...userData } = user[0].dataValues;
        const rightPassword = await bcrypt.compare(senha, encryptedPassword);

        if (!rightPassword) {
            return res.status(400).json({ success: false, message: 'Usuário ou senha inválida!' })
        }

        const token = jwt.sign({ id_usuario: userData.id_usuario, tipo_usuario: userData.tipo_usuario }, senhaJWT, { expiresIn: '8h' });

        return res.json({
            success: true,
            user: userData,
            token
        });
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
}

module.exports = login;
