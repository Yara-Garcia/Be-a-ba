require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const senhaJWT = require('../senhaJWT');

const resetPassword = async (req, res) => {
    const { email } = req.body;

    const token = jwt.sign({ email }, senhaJWT, { expiresIn: '1h' });

    // Configuração do transporte de email usando nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qqtechbeaba@gmail.com',
            pass: 'lajc oxbk sdnn ubxk'
        }
    });

    // Corpo do email
    let corpoEmail = `
        <p>Olá,</p>
        <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="http://localhost:3000/resetPassword/${token}">Clique aqui para redefinir sua senha</a>
        <p>Este link expirará em 1 hora.</p>
    `;

    // Configurações do email
    let info = await transporter.sendMail({
        from: 'process.env.EMAIL_ENVIO',
        to: email,
        subject: 'Recuperação de Senha',
        html: corpoEmail
    });

    console.log('Email enviado: %s', info.messageId);

    res.json({ success: true, message: 'Email de recuperação de senha enviado com sucesso!' });
};

module.exports = resetPassword;