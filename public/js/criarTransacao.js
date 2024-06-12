document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function () {
        this.parentElement.classList.toggle('show');
    });
});

document.querySelectorAll('.dropdown-search').forEach(search => {
    search.addEventListener('input', function () {
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

            // Verifica se o elemento pai do dropdown existe
            if (dropdownModules) {
                // Limpa o conteúdo atual do dropdown
                dropdownContent.innerHTML = '';

                // Itera sobre os módulos e adiciona os checkboxes ao dropdown
                modules.forEach(module => {
                    const label = document.createElement('label');

                    // Criar o input do tipo checkbox
                    const input = document.createElement('input');
                    input.className = 'checkbox';
                    input.type = 'checkbox';
                    input.value = module.id_modulo;

                    // Texto do módulo
                    const textNode = document.createTextNode(module.nome_modulo);

                    // Adicionar o input e o texto ao label
                    label.appendChild(input);
                    label.appendChild(textNode);

                    // Adicionar o label ao dropdownContent
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

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoTransaçoes.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede que o formulário seja submetido de maneira convencional

    const nomeTransacao = document.getElementById('nome-transacao').value;
    const descricao = document.getElementById('descricao').value;

    const dadosTransacao = {
        nome_transacao: nomeTransacao,
        descricao: descricao
    }

    fetch('http://localhost:3000/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosTransacao)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const idTransacao = data.transaction.id_transacao; // Obter o ID da transação criada

                // Chama a função para associar os módulos à transação
                associarModulos(idTransacao);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha na criação da transação: ' + error.message);
        });
});

// Função para associar os módulos à transação
async function associarModulos(idTransacao) {
    const dadosAssociacao = Array.from(document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked'))
        .map(input => {
            return {
                id_transacao: idTransacao,
                id_modulo: input.value
            };
        });
    console.log(dadosAssociacao)

    try {
        const response = await fetch('http://localhost:3000/moduleTransactionAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAssociacao)
        });

        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            alert('Transação criada e módulos associados com sucesso!');
            window.location.href = '../html/gestaoTransaçoes.html';
        } else {
            console.error('Erro:', data.message);
            alert('Falha na associação de módulos: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na associação de módulos: ' + error.message);
    }
}
