document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        this.parentElement.classList.toggle('show');
    });
});

document.querySelectorAll('.dropdown-search').forEach(search => {
    search.addEventListener('input', function (event) {
        event.preventDefault();
        var filter = this.value.toLowerCase();
        var labels = this.parentElement.querySelectorAll('label');
        labels.forEach(function (label) {
            var text = label.textContent.toLowerCase();
            if (text.includes(filter)) {
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
    });
});

window.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-search') && !event.target.matches('.checkbox')) {
        var dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove('show');
        });
    }
});


// Função para buscar e popular os módulos no dropdown de seleção de módulos
function buscarModulos() {
    fetch('http://localhost:3000/modules')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const modules = data.modules;
                const dropdownContent = document.getElementById('dropdownModulesContent');
                dropdownContent.innerHTML = '';

                modules.forEach(module => {
                    const label = document.createElement('label');
                    label.innerHTML = `
                        <input type="checkbox" class="module-checkbox" value="${module.id_modulo}">
                        ${module.nome_modulo}
                    `;
                    dropdownContent.appendChild(label);
                });

                // Adicionar listener para selecionar módulos
                document.querySelectorAll('.module-checkbox').forEach(input => {
                    input.addEventListener('change', function (event) {
                        event.preventDefault();
                        const selectedModules = Array.from(document.querySelectorAll('.module-checkbox:checked')).map(el => el.value);
                        buscarTransacoesAssociadas(selectedModules);
                    });
                });
            } else {
                console.error('Erro ao buscar módulos:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para buscar transações associadas aos módulos selecionados
function buscarTransacoesAssociadas(selectedModules) {
    console.log(selectedModules);
    fetch('http://localhost:3000/moduleTransactionAssociationsList')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const associatedTransactions = new Set();
                data.associations.forEach(association => {
                    const moduloString = association.id_modulo.toString();
                    if (selectedModules.includes(moduloString)) {
                        associatedTransactions.add(association.id_transacao);
                    }
                });

                fetch('http://localhost:3000/transactions')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Falha na requisição: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            const transactions = data.transactions.filter(transaction => associatedTransactions.has(transaction.id_transacao));
                            atualizarDropdownTransacoes(transactions);
                        } else {
                            console.error('Erro ao buscar transações:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            } else {
                console.error('Erro ao buscar associações de módulo/transação:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para atualizar o dropdown de transações com as transações filtradas
function atualizarDropdownTransacoes(transactions) {
    const transactionDropdown = document.getElementById('transactionsDropdownContent');
    transactionDropdown.innerHTML = '';

    transactions.forEach(transaction => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" class="transaction-checkbox" value="${transaction.id_transacao}">
            ${transaction.nome_transacao}
        `;
        transactionDropdown.appendChild(label);
    });

    document.getElementById('transactionsDropdown').style.display = transactions.length ? 'block' : 'none';

    // Adicionar listener para checkboxes das transações
    document.querySelectorAll('.transaction-checkbox').forEach(input => {
        input.addEventListener('change', function (event) {
            event.preventDefault();
            if (this.checked) {
                const transactionId = this.value;
                abrirModalDeFuncoes(transactionId);
            } else {
                // Caso o checkbox seja desmarcado, fechar o modal se estiver aberto
                $('#functionsModal').modal('hide');
            }
        });
    });
}

// Função para abrir o modal com funções associadas à transação selecionada
function abrirModalDeFuncoes(transactionId) {
    const modalBody = document.querySelector('#functionsModal .modal-body');
    modalBody.innerHTML = '';

    fetch('http://localhost:3000/functions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const functionsList = data.functions;

                functionsList.forEach(func => {
                    const label = document.createElement('label');
                    label.className = 'dropdown-item';
                    label.innerHTML = `
                        <input type="checkbox" class="function-checkbox" value="${func.id_funcao}">
                        ${func.nome_funcao}
                    `;
                    modalBody.appendChild(label);
                });

                // Mostra o modal após carregar as funções
                $('#functionsModal').modal('show');

                // Adicionar listener para o botão salvar dentro do modal
                document.getElementById('btn-salvar-modal').addEventListener('click', async function (event) {
                    event.preventDefault();

                    const perfilId = await criarPerfil();
                    const dadosAssociacaoTransacaoFuncao = Array.from(document.querySelectorAll('#functionsModal .modal-body input[type="checkbox"]:checked'))
                        .map(input => ({
                            id_transacao: transactionId,
                            id_funcao: input.value
                        }));

                    await associarModulos(perfilId);

                    await associarTransacoesFuncoes(perfilId, dadosAssociacaoTransacaoFuncao);

                    alert('Perfil criado e associações realizadas com sucesso!');
                    window.location.href = '../html/gestaoPerfis.html';
                });

                // Adicionar listener para o botão fechar dentro do modal
                document.getElementById('btn-fechar-modal').addEventListener('click', function (event) {
                    event.preventDefault();
                    $('#functionsModal').modal('hide');
                });

            } else {
                console.error('Erro ao buscar funções:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para criar um perfil
async function criarPerfil() {
    const nomePerfil = document.getElementById('nome-perfil').value;
    const descricao = document.getElementById('descricao').value;

    const dadosPerfil = {
        nome_perfil: nomePerfil,
        descricao: descricao
    };

    try {
        const responsePerfil = await fetch('http://localhost:3000/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPerfil)
        });

        if (!responsePerfil.ok) {
            throw new Error('Falha na requisição para criar perfil: ' + responsePerfil.statusText);
        }

        const dataPerfil = await responsePerfil.json();

        if (dataPerfil.success) {
            return dataPerfil.profile.id_perfil;
        } else {
            throw new Error('Falha ao criar perfil: ' + dataPerfil.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na criação do perfil: ' + error.message);
        throw error;
    }
}

// Função para associar módulos ao perfil
async function associarModulos(idPerfil) {
    const dadosAssociacao = Array.from(document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked'))
        .map(input => {
            return {
                id_perfil: idPerfil,
                id_modulo: input.value
            };
        });

    try {
        const response = await fetch('http://localhost:3000/profileModuleAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAssociacao)
        });

        if (!response.ok) {
            throw new Error('Falha na requisição para associar módulos: ' + response.statusText);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error('Falha ao associar módulos: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        throw error; // Lançar novamente o erro para que o bloco catch no botão salvar possa capturá-lo
    }
}


// Função para associar transações e funções ao perfil
async function associarTransacoesFuncoes(idPerfil, dadosAssociacaoTransacaoFuncao) {
    const dadosAssociacao = dadosAssociacaoTransacaoFuncao.map(associacao => ({
        id_perfil: idPerfil,
        id_transacao: associacao.id_transacao,
        id_funcao: associacao.id_funcao
    }));

    try {
        const response = await fetch('http://localhost:3000/profileFunctionAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAssociacao)
        });

        if (!response.ok) {
            throw new Error('Falha na requisição para associar transações e funções: ' + response.statusText);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error('Falha ao associar transações e funções: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        throw error; // Lançar novamente o erro para que o bloco catch no botão salvar possa capturá-lo
    }
}

// Event listener para o botão cancelar
document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoPerfis.html';
});

// Inicialização da página
buscarModulos();
