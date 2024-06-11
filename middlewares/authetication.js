const jwt = require('jsonwebtoken');
const Usuario = require("../models/usuarios");
const senhaJWT = require('../senhaJWT');

const authenticateUser = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ success: false, mensagem: 'Não autorizado!' });
    }

    try {
        const token = authorization.split(' ')[1];

        const { id_usuario } = jwt.verify(token, senhaJWT);

        const user = await Usuario.findAll({ where: { id_usuario: id_usuario } });


        if (user.length === 0) {
            return res.status(401).json({ mensagem: 'Usuario não encontrado!' });
        }

        const { senha, ...userData } = user[0];

        req.usuario = userData.dataValues;

        next();
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ mensagem: 'O usuário não está autenticado' });
    }
}

module.exports = authenticateUser;