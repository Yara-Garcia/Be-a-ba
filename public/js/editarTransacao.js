document.addEventListener('DOMContentLoaded', function () {
    // Adicionar evento de clique aos botões do dropdown para mostrar/ocultar o conteúdo
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar a navegação padrão
            this.parentElement.classList.toggle('show');
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

    //A PARTIR DAQUI NAO TA FUNCIONANDO. VERIFICAR

    // Evento de mudança do checkbox
    document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', async function (event) {
            event.preventDefault();
            const transactionId = url.searchParams.get('id_transacao');
            const moduleId = this.value;

            if (this.checked) {
                // Verificar se a associação já existe antes de criar uma nova
                const associationExists = await checkAssociation(transactionId, moduleId);

                if (!associationExists) {
                    try {
                        const response = await fetch('http://localhost:3000/moduleTransactionAssociation', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id_transacao: transactionId, id_modulo: moduleId })
                        });

                        if (!response.ok) {
                            throw new Error('Falha na requisição: ' + response.statusText);
                        }

                        const data = await response.json();
                        if (!data.success) {
                            throw new Error('Erro ao associar módulo: ' + data.message);
                        }
                    } catch (error) {
                        console.error('Erro:', error);
                        alert('Falha ao associar módulo: ' + error.message);
                        this.checked = false; // Desfaz a marcação do checkbox em caso de erro
                    }
                }
            } else {
                // Desassociar módulo
                try {
                    const response = await fetch('http://localhost:3000/moduleTransactionAssociation', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_transacao: transactionId, id_modulo: moduleId })
                    });

                    if (!response.ok) {
                        throw new Error('Falha na requisição: ' + response.statusText);
                    }

                    const data = await response.json();
                    if (!data.success) {
                        throw new Error('Erro ao desassociar módulo: ' + data.message);
                    }
                } catch (error) {
                    console.error('Erro:', error);
                    alert('Falha ao desassociar módulo: ' + error.message);
                    this.checked = true; // Marca o checkbox novamente em caso de erro
                }
            }
        });
    });
});

// Função para verificar se a associação já existe
async function checkAssociation(transactionId, moduleId) {
    try {
        const response = await fetch(`http://localhost:3000/moduleTransactionAssociation/check?transactionId=${transactionId}&moduleId=${moduleId}`);
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        const data = await response.json();
        return data.exists; // Retorna true se a associação existe, false caso contrário
    } catch (error) {
        console.error('Erro ao verificar associação:', error);
        alert('Erro ao verificar associação');
        return false; // Assume que a associação não existe em caso de erro
    }
}
