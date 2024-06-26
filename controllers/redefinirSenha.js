const { spawn } = require('child_process');
const path = require('path');
const jwt = require('jsonwebtoken');
const senhaSecreta = require('../senhaJWTRedefinirSenha');
const Usuario = require("../models/usuarios");
const bcrypt = require('bcrypt');


function generateResetToken(email) {
    const payload = {
        email: email
    };
    const options = {
        expiresIn: '1h' // Token expira em 1 hora
    };
    return jwt.sign(payload, senhaSecreta, options);
}

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken(email);

    // Caminho absoluto para o script Python
    const scriptPath = path.join(__dirname, '../utils/enviarEmail.py');

    // Inicializa o processo Python com os argumentos: email e token JWT
    const pythonProcess = spawn('python', [scriptPath, email, resetToken]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Resultado do script Python: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no script Python: ${data}`);
        res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, message: 'Email de recuperação de senha enviado com sucesso!', token: resetToken });
        } else {
            console.error(`Script Python encerrou com código de erro: ${code}`);
            res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
        }
    });
};

const resetPassword = async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        // Verifica se o token é válido
        const decoded = jwt.verify(token, senhaSecreta);

        const email = decoded.email;

        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Criptografa a nova senha usando bcrypt
        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        user.senha = hashedPassword;

        await user.save();

        res.json({ success: true, message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        res.status(400).json({ success: false, message: 'Token inválido ou expirado.' });
    }
};


module.exports = {
    generateResetToken,
    resetPasswordRequest,
    resetPassword
}
