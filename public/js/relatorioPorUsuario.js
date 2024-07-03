const token = localStorage.getItem('token');

const btnVisualizar = document.getElementById('btn-visualizar');
const modalBody = document.querySelector('.modal-body');

btnVisualizar.addEventListener('click', async function () {
    try {
        const responseFuncoes = await fetch('http://localhost:3000/perfilFuncaoNomes', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const dataFuncoes = await responseFuncoes.json();

        const responseModulos = await fetch('http://localhost:3000/perfilModuloNomes', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const dataModulos = await responseModulos.json();

        // Limpa o conteúdo anterior do modal
        modalBody.innerHTML = '';

        // Adiciona os dados ao modal
        const perfilInfo = document.createElement('p');
        perfilInfo.textContent = `Perfil: ${dataFuncoes[0].nome_perfil}`;
        modalBody.appendChild(perfilInfo);

        const modulosInfo = document.createElement('p');
        modulosInfo.textContent = 'Módulos associados: ';

        dataModulos.forEach(modulo => {
            modulosInfo.textContent += `${modulo.nome_modulo}, `;
        });

        // Remove a vírgula extra no final
        modulosInfo.textContent = modulosInfo.textContent.slice(0, -2);
        modalBody.appendChild(modulosInfo);

        // Cria uma lista de transações e suas funções
        const transacoesInfo = document.createElement('p');
        transacoesInfo.textContent = `Transações e suas respectivas funções: `;
        modalBody.appendChild(transacoesInfo);
        const transacoesList = document.createElement('ul');
        dataFuncoes.forEach(objeto => {
            const item = document.createElement('li');
            item.textContent = `${objeto.nome_transacao}: ${objeto.nome_funcao}`;
            transacoesList.appendChild(item);
        });
        modalBody.appendChild(transacoesList);

        // Mostra o modal
        await new bootstrap.Modal(document.getElementById('permissoesModal')).show();
    } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
    }
});

const btnFecharModal = document.querySelectorAll('#btn-fechar-modal, #btn-fechar-footer');

btnFecharModal.forEach(btn => {
    btn.addEventListener('click', function () {
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('permissoesModal'));
        modalInstance.hide();
    });
});

