const { spawn } = require('child_process');
const path = require('path');

const resetPassword = async (req, res) => {
    const { email } = req.body;

    // Caminho absoluto para o script Python
    const scriptPath = path.join(__dirname, '../utils/enviarEmail.py');

    // Inicializa o processo Python
    const pythonProcess = spawn('python', [scriptPath, email]);

    // Captura dos dados de saída (stdout)
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Resultado do script Python: ${data}`);
    });

    // Captura de erros (stderr)
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no script Python: ${data}`);
        res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
    });

    // Verifica o término do processo Python
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, message: 'Email de recuperação de senha enviado com sucesso!' });
        } else {
            console.error(`Script Python encerrou com código de erro: ${code}`);
            res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.' });
        }
    });
};

module.exports = resetPassword;
