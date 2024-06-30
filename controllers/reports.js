const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const usersReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/usuarioRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_usuarios.xlsx');

    // Executar o script Python
    exec(`python ${pythonScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar o script Python: ${error.message}`);
            return res.status(500).send('Erro ao gerar o relatório');
        }

        // Log para verificar o stdout e stderr do script Python
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        // Verificar se o arquivo foi gerado
        if (fs.existsSync(reportPath)) {
            // Enviar o arquivo gerado para o cliente
            res.download(reportPath, 'relatorio_usuarios.xlsx', (err) => {
                if (err) {
                    console.error(`Erro ao enviar o arquivo: ${err.message}`);
                }

                // Opcional: deletar o arquivo após o download
                fs.unlinkSync(reportPath);
            });
        } else {
            console.error('Arquivo não encontrado');
            res.status(500).send('Erro ao gerar o relatório');
        }
    });
};

module.exports = { usersReportDownload };
