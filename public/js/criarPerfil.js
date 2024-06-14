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

fetch('http://localhost:3000/modules', {
    method: 'GET'
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        return response.json();
    })

    .then(data => {
        if (data.success) {
            const modules = data.modules;

            const dropdownModules = document.getElementById('dropdownModules');
            const dropdownContent = dropdownModules.querySelector('.dropdown-content');

            if (dropdownModules) {
                dropdownContent.innerHTML = '';

                modules.forEach(module => {
                    const label = document.createElement('label');

                    const input = document.createElement('input');
                    input.className = 'checkbox';
                    input.type = 'checkbox';
                    input.value = module.id_modulo;

                    const textNode = document.createTextNode(module.nome_modulo);

                    label.appendChild(input);
                    label.appendChild(textNode);

                    dropdownContent.appendChild(label);
                });
            }
        } else {
            console.error('Erro ao buscar módulos:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });


document.querySelectorAll('#dropdownModules .checkbox').forEach(input => {
    input.addEventListener('change', function (event) {
        event.preventDefault();
        const modulosSelecionados = Array.from(document.querySelectorAll('#dropdownModules .checkbox:checked')).map(el => el.value);
        console.log(modulosSelecionados)

        fetch('http://localhost:3000/moduleTransactionAssociationsList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha na requisição: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const transacoesAssociadas = new Set();

                    data.associations.forEach(association => {
                        if (modulosSelecionados.includes(association.id_modulo)) {
                            transacoesAssociadas.add(association.id_transacao);
                        }
                    });

                    fetch('http://localhost:3000/transactions', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Falha na requisição: ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                const transactions = data.transactions.filter(transaction => transacoesAssociadas.has(transaction.id_transacao));
                                updateTransactionsDropdown(transactions);
                            } else {
                                console.error('Erro ao buscar transações:', data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                        });
                } else {
                    console.error('Erro ao buscar IDs de transações:', data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });
});

function updateTransactionsDropdown(transactions) {
    const transactionDropdown = document.querySelector('#transactionsDropdown .dropdown-content');
    transactionDropdown.innerHTML = '';

    transactions.forEach(transaction => {
        console.log(transactions)
        const label = document.createElement('label');
        label.className = 'dropdown-item';
        label.innerHTML = `<input type="checkbox" value="${transaction.id_transacao}">${transaction.nome_transacao}`;
        transactionDropdown.appendChild(label);
    });
    // Mostrar o dropdown de transações
    document.getElementById('transactionsDropdown').style.display = transactions.length ? 'block' : 'none';
}

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoTransacoes.html';
});

document.getElementById('btn-salvar').addEventListener('click', function (event) {
    event.preventDefault();
    //falta editar
});


/*function updateTransactionsDropdown(transactions) {
    const transactionDropdown = document.querySelector('#transactionsDropdown .dropdown-content');
    // Limpar o dropdown de transações
    transactionDropdown.innerHTML = '';
    // Adicionar as transações ao dropdown
    transactions.forEach(transaction => {
        const label = document.createElement('label');
        label.className = 'dropdown-item';
        label.innerHTML = `<input type="checkbox" value="${transaction.id}">${transaction.nome}`;
        transactionDropdown.appendChild(label);
    });
    // Mostrar o dropdown de transações
    document.getElementById('transactionsDropdown').style.display = transactions.length ? 'block' : 'none';
}


document.querySelectorAll('#dropdownModules .checkbox').forEach(input => {
    input.addEventListener('change', function () {
        const selectedModules = Array.from(document.querySelectorAll('#dropdownModules .checkbox:checked')).map(el => el.value);
        const transactionDropdown = document.querySelector('#transactionsDropdown .dropdown-content');


        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'dropdown-search';
        searchInput.placeholder = 'Buscar...';


        while (transactionDropdown.firstChild) {
            transactionDropdown.removeChild(transactionDropdown.firstChild);
        }

        transactionDropdown.appendChild(searchInput);

        let transactionItems = new Set();
        selectedModules.forEach(module => {
            modules[module].forEach(transaction => {
                transactionItems.add(transaction);
            });
        });

        transactionItems.forEach(transaction => {
            const label = document.createElement('label');
            label.className = 'dropdown-item';
            label.innerHTML = `<input type="checkbox" value="${transaction}">${transaction}`;
            label.querySelector('input').addEventListener('change', function () {
                if (this.checked) {
                    openFunctionsModal(transaction);
                }
            });
            transactionDropdown.appendChild(label);
        });
        document.getElementById('transactionsDropdown').style.display = selectedModules.length ? 'block' : 'none';
    });
});

function openFunctionsModal(transaction) {
    const modalBody = document.querySelector('#functionsModal .modal-body');
    modalBody.innerHTML = '';
    transactions[transaction].forEach(func => {
        const label = document.createElement('label');
        label.className = 'dropdown-item';
        label.innerHTML = `<input type="checkbox" value="${func}">${func}`;
        modalBody.appendChild(label);
    });
    $('#functionsModal').modal('show');
}*/