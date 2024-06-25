const { PythonShell } = require('python-shell');
const path = require('path');

const resetPassword = async (req, res) => {
    const { email } = req.body;

    let options = {
        mode: 'text',
        scriptPath: path.join(__dirname, '../utils'),
        args: [email]
    };

    PythonShell.run('enviarEmail.py', options, function (err, results) {
        if (err) {
            console.error('Erro ao chamar script Python:', err);
            return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
        }

        console.log('Resultado do script Python:', results);
        res.json({ success: true, message: 'Email de recuperação de senha enviado com sucesso!' });
    });
};

module.exports = resetPassword;
