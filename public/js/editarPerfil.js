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

        await carregarModulos(profileData);
        await carregarTransacoes(profileData);
    }

    catch (error) {
        console.error('Erro ao carregar informações do perfil:', error);
        alert('Erro ao carregar informações do perfil');
    }
}

async function carregarModulos(profileData) {
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

async function carregarTransacoes(profileData) {
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
    })
}

async function carregarFuncoes() {
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

//falta definir como editar as funções e fazer lógica pra novas associações e desassociações 
