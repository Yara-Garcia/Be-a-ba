function abrirModal() {
    document.getElementById('btn-gerar-relatorio').addEventListener('click', function (event) {
        event.preventDefault();
        const modalBody = document.querySelector('#reportModal .modal-body');
        modalBody.innerHTML = '';

        // Adiciona os checkboxes corretamente ao modal
        modalBody.innerHTML += `
            <input type="checkbox" class="report-checkbox" value="Usuarios"> Usuários <br>
            <input type="checkbox" class="report-checkbox" value="Perfis"> Perfis <br>
            <input type="checkbox" class="report-checkbox" value="Modulos"> Módulos <br>
            <input type="checkbox" class="report-checkbox" value="Transacoes"> Transações <br>
            <input type="checkbox" class="report-checkbox" value="Funcoes"> Funções <br>
             <input type="checkbox" class="report-checkbox" value="Perfil-Modulos"> Perfil - Módulos <br>
             <input type="checkbox" class="report-checkbox" value="Perfil-Funcoes"> Perfil - Transações - Funções <br>
             <input type="checkbox" class="report-checkbox" value="Modulos-Transacoes"> Módulos - Transações <br>
        `;

        $('#reportModal').modal('show');

        document.getElementById('btn-fechar-modal').removeEventListener('click', fecharModal);
        document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);
    });
}

function fecharModal(event) {
    event.preventDefault();
    $('#reportModal').modal('hide');
}

abrirModal();

document.getElementById('btn-download-modal').addEventListener('click', function () {
    let checkboxes = document.querySelectorAll('.report-checkbox:checked');
    let selectedReports = Array.from(checkboxes).map(checkbox => checkbox.value);
    console.log(selectedReports)

    const token = localStorage.getItem('token');

    if (selectedReports.length > 0) {
        // Função para fazer o download do relatório
        const downloadReport = (url, filename) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reports: selectedReports })
            })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    throw new Error('Erro ao gerar o relatório');
                })
                .then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename; // Nome do arquivo de download
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Erro ao gerar o relatório:', error);
                });
        };

        // Checar quais relatórios foram selecionados e fazer o fetch adequado
        if (selectedReports.includes('Usuarios')) {
            downloadReport('http://localhost:3000/usersReport', 'relatorio_usuarios.xlsx');
        }
        if (selectedReports.includes('Perfis')) {
            downloadReport('http://localhost:3000/profilesReport', 'relatorio_perfis.xlsx');
        }
        if (selectedReports.includes('Modulos')) {
            downloadReport('http://localhost:3000/modulesReport', 'relatorio_modulos.xlsx');
        }
        if (selectedReports.includes('Transacoes')) {
            downloadReport('http://localhost:3000/transactionsReport', 'relatorio_transacoes.xlsx');
        }
        if (selectedReports.includes('Funcoes')) {
            downloadReport('http://localhost:3000/functionsReport', 'relatorio_funcoes.xlsx');
        }

        if (selectedReports.includes('Perfil-Modulos')) {
            downloadReport('http://localhost:3000/profileModuleReport', 'relatorio_perfilModulos.xlsx');
        }

        if (selectedReports.includes('Perfil-Funcoes')) {
            downloadReport('http://localhost:3000/profileFunctionReport', 'relatorio_perfilTransacoesFuncoes.xlsx');
        }

        if (selectedReports.includes('Modulos-Transacoes')) {
            downloadReport('http://localhost:3000/moduleTransactionReport', 'relatorio_modulosTransacoes.xlsx');
        }

    } else {
        alert('Por favor, selecione pelo menos um relatório.');
    }
});
