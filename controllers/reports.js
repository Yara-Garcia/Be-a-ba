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

const profilesReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/perfisRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_perfis.xlsx');

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
            res.download(reportPath, 'relatorio_perfis.xlsx', (err) => {
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

const transactionsReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/transacoesRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_transacoes.xlsx');

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
            res.download(reportPath, 'relatorio_transacoes.xlsx', (err) => {
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

const modulesReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/modulosRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_modulos.xlsx');

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
            res.download(reportPath, 'relatorio_modulos.xlsx', (err) => {
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

const functionsReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/funcoesRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_funcoes.xlsx');

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
            res.download(reportPath, 'relatorio_funcoes.xlsx', (err) => {
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

const profileModulesReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/perfilModuloRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_perfilModulos.xlsx');

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
            res.download(reportPath, 'relatorio_perfilModulos.xlsx', (err) => {
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

const profileFunctionsReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/perfilTransacaoFuncaoRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_perfilTransacoesFuncoes.xlsx');

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
            res.download(reportPath, 'relatorio_perfilTransacoesFuncoes.xlsx', (err) => {
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

const modulesTransactionsReportDownload = (req, res) => {
    const pythonScript = path.join(__dirname, '../utils/moduloTransacoesRelatorio.py');
    const reportPath = path.join(__dirname, '../utils/relatorio_modulosTransacoes.xlsx');

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
            res.download(reportPath, 'relatorio_modulosTransacoes.xlsx', (err) => {
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

module.exports = {
    usersReportDownload,
    profilesReportDownload,
    transactionsReportDownload,
    modulesReportDownload,
    functionsReportDownload,
    profileModulesReportDownload,
    profileFunctionsReportDownload,
    modulesTransactionsReportDownload
};
