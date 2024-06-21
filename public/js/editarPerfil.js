document.addEventListener('DOMContentLoaded', function () {
    // Adicionar evento de clique aos botões do dropdown para mostrar/ocultar o conteúdo
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            this.parentElement.classList.toggle('show');
        });
    });

})

async function carregarInformacoesPerfil(perfilId) {
    try {
        const response = await fetch(`http://localhost:3000/profile/${perfilId}`);
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const profileData = data.profile;
        console.log(profileData)

        document.getElementById('nome-perfil').value = profileData.nome_perfil;
        document.getElementById('descricao').value = profileData.descricao;

        await carregarModulosAssociados(profileData);
        await carregarTransacoesAssociadas(profileData);
    }

    catch (error) {
        console.error('Erro ao carregar informações do perfil:', error);
        alert('Erro ao carregar informações do perfil');
    }
}

async function carregarModulosAssociados(profileData) {
    const dropdownContent = document.querySelector('#dropdownModulesContent');
    dropdownContent.innerHTML = '';

    // Carregar todos os módulos disponíveis
    const modulesResponse = await fetch('http://localhost:3000/modules');
    if (!modulesResponse.ok) {
        throw new Error('Falha na requisição dos módulos: ' + modulesResponse.statusText);
    }
    const modulesData = await modulesResponse.json();
    const availableModules = modulesData.modules;

    // Marcar os checkboxes dos módulos disponíveis e associados ao perfil
    availableModules.forEach(module => {
        const checkbox = document.createElement('input');
        checkbox.className = 'checkbox';
        checkbox.type = 'checkbox';
        checkbox.value = module.id_modulo;
        checkbox.textContent = module.nome_modulo;

        // Verificar se o módulo está associado ao perfil e marcar o checkbox, se necessário
        const isModuleAssociated = profileData.Modulos.some(mod => mod.id_modulo === module.id_modulo);

        if (isModuleAssociated) {
            checkbox.checked = true;
        }

        // Adicionar o checkbox ao dropdownContent
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(module.nome_modulo));
        dropdownContent.appendChild(label);
        dropdownContent.appendChild(document.createElement('br'));
    })
}

async function carregarTransacoesAssociadas(profileData) {
    const dropdownContent = document.querySelector('#transactionsDropdownContent');
    dropdownContent.innerHTML = '';

    const transactionsResponse = await fetch('http://localhost:3000/transactions');
    if (!transactionsResponse.ok) {
        throw new Error('Falha na requisição das transações: ' + transactionsResponse.statusText);
    }
    const transactionsData = await transactionsResponse.json();
    const availableTransactions = transactionsData.transactions;

    // Marcar os checkboxes dos módulos disponíveis e associados ao perfil
    availableTransactions.forEach(transaction => {
        const checkbox = document.createElement('input');
        checkbox.className = 'checkbox';
        checkbox.type = 'checkbox';
        checkbox.value = transaction.id_transacao;
        checkbox.textContent = transaction.nome_transacao;

        // Verificar se o módulo está associado ao perfil e marcar o checkbox, se necessário
        const isTransactionAssociated = profileData.Transacaos.some(object => object.id_transacao === transaction.id_transacao);

        if (isTransactionAssociated) {
            checkbox.checked = true;
        }

        // Adicionar o checkbox ao dropdownContent
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(transaction.nome_transacao));
        dropdownContent.appendChild(label);
        dropdownContent.appendChild(document.createElement('br'));

        /*checkbox.addEventListener('change', async function () {
            if (this.checked) {
                await carregarFuncoesAssociadas(transaction.id_transacao, profileData);
            }
        });*/
    })
}

async function carregarFuncoesAssociadas() {
    const dropdownContent = document.querySelector('.modal-content');
    dropdownContent.innerHTML = '';

    const functionsResponse = await fetch('http://localhost:3000/functions');
    if (!functionsResponse.ok) {
        throw new Error('Falha na requisição das funções: ' + functionsResponse.statusText);
    }
    const functionsData = await functionsResponse.json();
    const availableFunctions = functionsData.functions;

    // Marcar os checkboxes dos módulos disponíveis e associados ao perfil
    availableFunctions.forEach(func => {
        const checkbox = document.createElement('input');
        checkbox.className = 'checkbox';
        checkbox.type = 'checkbox';
        checkbox.value = func.id_funcao;
        checkbox.textContent = func.id_funcao;

        // Verificar se o módulo está associado ao perfil e marcar o checkbox, se necessário
        const isFunctionAssociated = profileData.Transacaos.PerfilFuncao.some(object => object.id_funcao === func.id_funcao);

        if (isFunctionAssociated) {
            checkbox.checked = true;
        }

        // Adicionar o checkbox ao dropdownContent
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(func.nome_funcao));
        dropdownContent.appendChild(label);
        dropdownContent.appendChild(document.createElement('br'));
    })
}

// Seção para carregar informações da transação ao carregar a página
const url = new URL(window.location.href);
const perfilId = url.searchParams.get('id_perfil');
if (perfilId) {
    carregarInformacoesPerfil(perfilId);
}

let associacoesPreSalvas = [];
let moduloId = null;
let transacaoId = null;
let funcaoId = null;

async function salvarFuncoesModal(transacaoId) {
    try {
        const modulosParaAssociacaoTransacaoFuncao = Array.from(document.querySelectorAll('.modal-content input[type="checkbox"]:checked'))
            .map(input => ({
                id_transacao: transacaoId,
                id_funcao: input.value
            }));

        // Limpar e adicionar novas associações temporariamente
        associacoesPreSalvas = [];
        associacoesPreSalvas.push(...modulosParaAssociacaoTransacaoFuncao);

        alert('Funções selecionadas salvas temporariamente!');
        $('#functionsModal').modal('hide');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao salvar associações: ' + error.message);
    }
}

//---------------------------------

// Função para verificar se a associação de perfil e modulo já existe
async function checarAssociacaoPerfilModulo(perfilId, moduloId) {
    try {
        const response = await fetch(`http://localhost:3000/profileModuleAssociationsList`);
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const associations = data.associations;


        let associationExists = false;
        let associationId = null;

        for (let association of associations) {
            if (String(perfilId) === String(association.id_perfil) && String(moduloId) === String(association.id_modulo)) {
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

async function checarAssociacaoPerfilTransacaoFuncao(perfilId, transacaoId, funcaoId) {
    try {
        const response = await fetch(`http://localhost:3000/profileFunctionAssociationsList`);
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const associations = data.associations;

        let associationExists = false;
        let associationId = null;

        for (let association of associations) {
            if (String(perfilId) === String(association.id_perfil) && String(transacaoId) === String(association.id_transacao) && String(funcaoId) === String(association.id_funcao)) {
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
    window.location.href = '../html/gestaoPerfis.html';
});

// Função para associar os módulos à perfil
async function associarModulos(modulosParaAssociacao) {
    try {
        const response = await fetch('http://localhost:3000/profileModuleAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modulosParaAssociacao)
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
        const response = await fetch(`http://localhost:3000/deleteProfileModuleAssociation/${associationId}`, {
            method: 'DELETE',
            headers: {
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


async function associarTransacoesEFuncoes(dadosParaAssociacao) {
    try {
        const response = await fetch('http://localhost:3000/profileFunctionAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosParaAssociacao)
        });

        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Transações e funções associadas com sucesso!');
        } else {
            throw new Error('Erro ao associar: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao associar: ' + error.message);
    }
}

// Função para desassociar os módulos da transação
async function desassociarTransacoesEPerfis(associationId) {
    try {
        const response = await fetch(`http://localhost:3000/deleteProfileFunctionAssociation/${associationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }

        const data = await response.json();

        if (data.success) {
            console.log('Desassociações realizadas com sucesso!');
        } else {
            throw new Error('Erro ao desassociar transações e/ou funções: ' + data.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao desassociar transações e/ou funções: ' + error.message);
    }
}

document.getElementById('btn-salvar').addEventListener('click', async function (event) {
    event.preventDefault();
    const nomePerfil = document.getElementById('nome-perfil').value;
    const descricao = document.getElementById('descricao').value;

    const dadosPerfil = {
        nome_perfil: nomePerfil,
        descricao: descricao
    };

    fetch(`http://localhost:3000/profile/${perfilId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosPerfil)
    })
        .then(response => {
            if (!response.ok) {
                const error = response.statusText;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Edição de perfil realizada com sucesso!');

            } else {
                console.log('Data:', data.message)
                alert('Falha na edição: ' + data.message);
            }
        })

    try {
        const checkboxes = document.querySelectorAll('#dropdownModulesContent input[type="checkbox"]');
        const modulosParaAssociacao = [];
        const modulosParaDesassociacao = [];

        for (let checkbox of checkboxes) {
            const moduloId = checkbox.value;

            // Verificar se a associação já existe antes de criar uma nova
            const { exists: associationExists, id: associationId } = await checarAssociacaoPerfilModulo(perfilId, moduloId);

            if (checkbox.checked) {
                if (!associationExists) {
                    modulosParaAssociacao.push({
                        id_perfil: perfilId,
                        id_modulo: moduloId
                    });
                }
            } else {
                if (associationExists) {
                    modulosParaDesassociacao.push(associationId);
                }
            }
        }
        // Se houver novas associações a serem feitas
        if (modulosParaAssociacao.length > 0) {
            await associarModulos(modulosParaAssociacao);
        }

        // Se houver associações a serem desfeitas
        if (modulosParaDesassociacao.length > 0) {
            for (let associationId of modulosParaDesassociacao) {
                await desassociarModulos(associationId);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na edição do módulo: ' + error.message);
    }

    //alteração de transações e funções
    try {
        const checkboxes = document.querySelectorAll('#transactionsDropdownContent input[type="checkbox"]');
        const dadosParaAssociacao = [];
        const dadosParaDesassociacao = [];

        for (let checkbox of checkboxes) {
            const transacaoId = checkbox.value;

            // Verificar se a associação já existe antes de criar uma nova
            const { exists: associationExists, id: associationId } = await checarAssociacaoPerfilTransacaoFuncao(perfilId, transacaoId, funcaoId);

            if (checkbox.checked) {
                if (!associationExists) {
                    dadosParaAssociacao.push({
                        id_perfil: perfilId,
                        id_transacao: transacaoId,
                        id_funcao: funcaoId
                    });
                }
            } else {
                if (associationExists) {
                    dadosParaAssociacao.push(associationId);
                }
            }
        }
        // Se houver novas associações a serem feitas
        if (dadosParaAssociacao.length > 0) {
            await associarTransacoesEFuncoes(dadosParaAssociacao);
        }

        // Se houver associações a serem desfeitas
        if (dadosParaDesassociacao.length > 0) {
            for (let associationId of dadosParaDesassociacao) {
                await desassociarTransacoesEPerfis(associationId);
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na edição do perfil: ' + error.message);
    }

    window.location.href = '../html/gestaoPerfis.html';
});


