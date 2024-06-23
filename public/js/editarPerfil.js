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
        checkbox.className = 'transaction-checkbox';
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

        checkbox.addEventListener('change', async function () {
            if (this.checked) {
                let transactionId = this.value;

                abrirModalDeFuncoes(transactionId, profileData);

            }
        });
    })
}

async function carregarFuncoesAssociadas(transacaoId, profileData) {
    const modalBody = document.querySelector('#functionsModal .modal-body');
    modalBody.innerHTML = ''; // Limpa o conteúdo anterior do modal

    try {
        const response = await fetch(`http://localhost:3000/functions`);
        if (!response.ok) {
            throw new Error('Falha na requisição das funções: ' + response.statusText);
        }
        const functionsData = await response.json();
        const availableFunctions = functionsData.functions;

        // Marcar os checkboxes das funções disponíveis e associadas à transação
        availableFunctions.forEach(func => {
            const checkbox = document.createElement('input');
            checkbox.className = 'function-checkbox';
            checkbox.type = 'checkbox';
            checkbox.value = func.id_funcao;
            checkbox.textContent = func.nome_funcao;

            const isFunctionAssociated = profileData.Transacaos.some(transacao => {
                if (transacao.id_transacao.toString() === transacaoId.toString()) {
                    return transacao.Funcaos.some(funcao => {
                        return (
                            funcao.id_funcao.toString() === func.id_funcao.toString() &&
                            funcao.PerfilFuncao.id_transacao.toString() === transacaoId.toString()
                        );
                    });
                }
                return false; // Caso a transação específica não seja encontrada
            });

            if (isFunctionAssociated) {
                checkbox.checked = true;
            }

            const space = document.createTextNode(' ');
            // Adicionar o checkbox ao modalBody
            const label = document.createElement('label');
            label.appendChild(checkbox);
            label.appendChild(space);
            label.appendChild(document.createTextNode(func.nome_funcao));
            modalBody.appendChild(label);
            modalBody.appendChild(document.createElement('br'));


        });

    } catch (error) {
        console.error('Erro ao carregar funções associadas:', error);
        alert('Erro ao carregar funções associadas');
    }
}

let funcoesSelecionadas = [];

async function abrirModalDeFuncoes(transactionId, profileData) {
    const modalBody = document.querySelector('#functionsModal .modal-body');
    modalBody.innerHTML = ''; // Limpa o conteúdo anterior do modal

    // Carrega as funções associadas dentro do modal
    await carregarFuncoesAssociadas(transactionId, profileData);

    $('#functionsModal').modal('show');

    // Adicionar evento de change aos checkboxes de função dentro do modal
    modalBody.querySelectorAll('.function-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const funcaoId = this.value;
            const isChecked = this.checked;

            if (isChecked) {
                funcoesSelecionadas.push({ id_transacao: transactionId, id_funcao: funcaoId });
            } else {
                // Remove a função da lista de funções selecionadas, se já estiver lá
                funcoesSelecionadas = funcoesSelecionadas.filter(item =>
                    !(item.id_transacao === transactionId && item.id_funcao === funcaoId)
                );
            }
        });
    });

    // Marcar os checkboxes das funções já associadas a essa transação
    profileData.Transacaos.forEach(assoc => {
        if (assoc.PerfilFuncao.id_transacao === transactionId) {
            const checkbox = modalBody.querySelector(`.function-checkbox[value="${assoc.PerfilFuncao.id_funcao}"]`);
            console.log(checkbox)
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });
}

function fecharModal(event) {
    event.preventDefault();
    $('#functionsModal').modal('hide');
}

const url = new URL(window.location.href);
const perfilId = url.searchParams.get('id_perfil');
if (perfilId) {
    carregarInformacoesPerfil(perfilId);
}

let associacoesPreSalvas = [];
let moduloId = null;
let transacaoId = null;

async function salvarFuncoesModal(transacaoId) {
    try {
        // Obter os checkboxes marcados atualmente
        const checkboxesMarcados = document.querySelectorAll('#functionsModal .modal-body input[type="checkbox"]:checked');

        // Mapear os checkboxes marcados para objetos { id_transacao, id_funcao }
        const novasAssociacoes = Array.from(checkboxesMarcados).map(input => ({
            id_transacao: transacaoId,
            id_funcao: input.value
        }));

        // Atualizar o array de associações pré-salvas com as novas associações
        associacoesPreSalvas = associacoesPreSalvas.concat(novasAssociacoes);

        // Atualizar o perfilId nas associações pré-salvas (opcional, se necessário)
        associacoesPreSalvas.forEach(associacao => {
            associacao.id_perfil = perfilId;
        });

        // Mostrar alerta de sucesso
        alert('Funções selecionadas salvas temporariamente!');
        $('#functionsModal').modal('hide');
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao salvar funções: ' + error.message);
    }
}

document.getElementById('btn-salvar-modal').addEventListener('click', function (event) {
    event.preventDefault();
    let transacaoId = null;

    // Encontra o checkbox de transação marcado
    document.querySelectorAll('.transaction-checkbox').forEach(input => {
        if (input.checked) {
            transacaoId = input.value;
        }
    });

    if (transacaoId) {
        salvarFuncoesModal(transacaoId);
        fecharModal(event);
    } else {
        alert('Não foi possível salvar as funções!');
    }
});

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

async function checarAssociacaoPerfilTransacaoFuncao(perfilId, associacoesPreSalvas) {
    console.log(associacoesPreSalvas)
    try {
        if (!Array.isArray(associacoesPreSalvas) || associacoesPreSalvas.length === 0) {
            throw new Error('Associações pré-salvas inválidas ou vazias.');
        }

        const response = await fetch(`http://localhost:3000/profileFunctionAssociationsList`);
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        const associations = data.associations;

        let associationExists = false;
        let associationId = null;

        // Itera sobre cada associação pré-salva
        for (let i = 0; i < associacoesPreSalvas.length; i++) {
            const currentAssociacao = associacoesPreSalvas[i];

            // Verifica se há uma associação correspondente nos dados recebidos
            const found = associations.find(association =>
                String(perfilId) === String(association.id_perfil) &&
                String(currentAssociacao.id_transacao) === String(association.id_transacao) &&
                String(currentAssociacao.id_funcao) === String(association.id_funcao)
            );

            // Se encontrou uma correspondência, define exists como true e associationId como o ID da associação
            if (found) {
                console.log(found)
                associationExists = true;
                associationId = found.id_associacao;
                break;
            }
        }

        return { exists: associationExists, id: associationId };
    } catch (error) {
        console.error('Erro ao verificar associação:', error);
        alert('Erro ao verificar associação');
    }
}

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


async function associarTransacoesEFuncoes(associacoesPreSalvas) {


    try {
        const response = await fetch('http://localhost:3000/profileFunctionAssociation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(associacoesPreSalvas)
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

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoPerfis.html';
});

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

    try {
        const checkboxes = document.querySelectorAll('#transactionsDropdownContent input[type="checkbox"]');
        let dadosParaAssociacao = [];
        let dadosParaDesassociacao = [];

        // Itera sobre cada checkbox usando for...of para poder usar await corretamente
        for (let checkbox of checkboxes) {
            const transacaoId = checkbox.value;

            // Verifica a associação para o perfil, transação e função atuais
            const { exists: associationExists, id: associationId } = await checarAssociacaoPerfilTransacaoFuncao(perfilId, associacoesPreSalvas);


            if (checkbox.checked) {
                if (!associationExists) {
                    dadosParaAssociacao = [];
                    for (associacao of associacoesPreSalvas) {
                        dadosParaAssociacao.push({
                            id_perfil: perfilId,
                            id_transacao: associacao.id_transacao,
                            id_funcao: associacao.id_funcao
                        });
                        console.log(dadosParaAssociacao)
                    }

                }
            } else {
                if (associationExists) {
                    // Adiciona o ID da associação para desassociação
                    dadosParaDesassociacao.push(associationId);
                }
            }
        }
        // Se houver novas associações a serem feitas
        if (dadosParaAssociacao.length > 0) {
            console.log(dadosParaAssociacao)
            await associarTransacoesEFuncoes(dadosParaAssociacao);
        }
        console.log(dadosParaAssociacao)
        console.log(dadosParaDesassociacao)
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
})

//window.location.href = '../html/gestaoPerfis.html';*/




