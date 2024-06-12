document.addEventListener('DOMContentLoaded', function () {
    // Adicionar evento de clique aos botões do dropdown para mostrar/ocultar o conteúdo
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.classList.toggle('show');
        });
    });

    // Adicionar evento de entrada aos campos de pesquisa do dropdown para filtrar os módulos
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

    // Função para carregar informações da transação e módulos associados
    async function carregarInformacoesTransacao(transactionId) {
        try {
            const response = await fetch(`http://localhost:3000/transaction/${transactionId}`);
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            const data = await response.json();
            const transactionData = data.transaction;

            document.getElementById('nome-transacao').value = transactionData.nome_transacao;
            document.getElementById('descricao').value = transactionData.descricao;

            const dropdownContent = document.querySelector('.dropdown-content');
            dropdownContent.innerHTML = ''; // Limpar o conteúdo atual

            // Carregar todos os módulos disponíveis
            const modulesResponse = await fetch('http://localhost:3000/modules');
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
                if (transactionData.Modulos.id_modulo && transactionData.Modulos.includes(module.id_modulo)) {
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
});
