const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', function () {
    // Adicionar evento de clique aos botões do dropdown para mostrar/ocultar o conteúdo
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            this.parentElement.classList.toggle('show');
        });
    });

})

// Função para carregar informações da transação e módulos associados
async function carregarInformacoesTransacao(transactionId) {
    try {
        const response = await fetch(`http://localhost:3000/transaction/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const transactionData = data.transaction;

        document.getElementById('nome-transacao').value = transactionData.nome_transacao;
        document.getElementById('descricao').value = transactionData.descricao;

        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.innerHTML = '';

        // Carregar todos os módulos disponíveis
        const modulesResponse = await fetch('http://localhost:3000/modules', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!modulesResponse.ok) {
            throw new Error('Falha na requisição dos módulos: ' + modulesResponse.statusText);
        }
        const modulesData = await modulesResponse.json();
        const availableModules = modulesData.modules;

        // Marcar os checkboxes dos módulos disponíveis e associados à transação
        availableModules.forEach(module => {
            const checkbox = document.createElement('input');
            checkbox.className = 'checkbox';
            checkbox.type = 'checkbox';
            checkbox.value = module.id_modulo;
            checkbox.textContent = module.nome_modulo;


            // Verificar se o módulo está associado à transação e marcar o checkbox, se necessário
            const isModuleAssociated = transactionData.Modulos.some(mod => mod.id_modulo === module.id_modulo);

            if (isModuleAssociated) {
                checkbox.checked = true;
            }

            // Adicionar o checkbox ao dropdownContent
            const label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(module.nome_modulo));
            dropdownContent.appendChild(label);
            dropdownContent.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Erro ao carregar informações da transação:', error);
        alert('Erro ao carregar informações da transação');
    }
}

// Seção para carregar informações da transação ao carregar a página
const url = new URL(window.location.href);
const transactionId = url.searchParams.get('id_transacao');
if (transactionId) {
    carregarInformacoesTransacao(transactionId);
}


// Função para verificar se a associação já existe
async function checkAssociation(transactionId, moduleId) {
    try {
        const response = await fetch(`http://localhost:3000/moduleTransactionAssociationsList`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const associations = data.associations;


        let associationExists = false;
        let associationId = null;

        for (let association of associations) {
            if (String(transactionId) === String(association.id_transacao) && String(moduleId) === String(association.id_modulo)) {
                associationExists = true;
                associationId = association.id_associacao;
                break;
            }
        }
        return { exists: associationExists, id: associationId };
    } catch (error) {
        console.error('Erro ao verificar associação:', error);
        alert('Erro ao verificar associação');
    }
}

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoTransacoes.html';
});

// Função para associar os módulos à transação
async function associarModulos(dadosAssociacao) {
    try {
        const response = await fetch('http://localhost:3000/moduleTransactionAssociation', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAssociacao)
        });

        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Módulos associados com sucesso!');
        } else {
            throw new Error('Erro ao associar módulos: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao associar módulos: ' + error.message);
    }
}

// Função para desassociar os módulos da transação
async function desassociarModulos(associationId) {
    try {
        const response = await fetch(`http://localhost:3000/deleteModuleTransactionAssociation/${associationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Módulos desassociados com sucesso!');
        } else {
            throw new Error('Erro ao desassociar módulos: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao desassociar módulos: ' + error.message);
    }
}

document.getElementById('btn-salvar').addEventListener('click', async function (event) {
    event.preventDefault();
    const nomeTransacao = document.getElementById('nome-transacao').value;
    const descricao = document.getElementById('descricao').value;

    const dadosTransacao = {
        nome_transacao: nomeTransacao,
        descricao: descricao
    };

    fetch(`http://localhost:3000/transaction/${transactionId}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosTransacao)
    })
        .then(response => {
            if (!response.ok) {
                const error = response.statusText;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Edição de transação realizada com sucesso!');

            } else {
                console.log('Data:', data.message)
                alert('Falha na edição: ' + data.message);
            }
        })

    try {
        const checkboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
        const dadosAssociacao = [];
        const dadosDesassociacao = [];

        for (let checkbox of checkboxes) {
            const moduleId = checkbox.value;

            // Verificar se a associação já existe antes de criar uma nova
            const { exists: associationExists, id: associationId } = await checkAssociation(transactionId, moduleId);

            if (checkbox.checked) {
                if (!associationExists) {
                    dadosAssociacao.push({
                        id_transacao: transactionId,
                        id_modulo: moduleId
                    });
                }
                console.log(dadosAssociacao)
            } else {
                if (associationExists) {
                    dadosDesassociacao.push(associationId);
                }
            }
        }
        console.log(dadosDesassociacao)
        // Se houver novas associações a serem feitas
        if (dadosAssociacao.length > 0) {
            await associarModulos(dadosAssociacao);
        }

        // Se houver associações a serem desfeitas
        if (dadosDesassociacao.length > 0) {
            for (let associationId of dadosDesassociacao) {
                await desassociarModulos(associationId);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na edição da transação: ' + error.message);
    }
    window.location.href = '../html/gestaoTransacoes.html';
});

