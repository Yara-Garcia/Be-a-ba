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
function fetchModules() {
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
                        fetchAssociatedTransactions(selectedModules);
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
function fetchAssociatedTransactions(selectedModules) {
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
                            updateTransactionsDropdown(transactions);
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
function updateTransactionsDropdown(transactions) {
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

    // Adicionar listener para abrir o modal com funções associadas à transação
    document.querySelectorAll('.transaction-checkbox').forEach(input => {
        input.addEventListener('change', function (event) {
            event.preventDefault();
            if (this.checked) {
                const transactionId = this.value;
                openFunctionsModal(transactionId);
            }
        });
    });
}

//Função para abrir o modal com funções associadas à transação selecionada
function openFunctionsModal(transactionId) {
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
                    label.innerHTML = `<input type="checkbox" value="${func.id_funcao}">
                    ${func.nome_funcao}`;
                    modalBody.appendChild(label);
                })
            } else {
                console.error('Erro ao buscar funções:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });

    $('#functionsModal').modal('show');
    console.log('Abrir modal com funções para a transação:', transactionId);
}

// Event listener para o botão cancelar
document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoPerfis.html';
});

// Event listener para o botão salvar
document.getElementById('btn-salvar').addEventListener('click', function (event) {
    event.preventDefault();

});

// Inicialização da página
fetchModules();

