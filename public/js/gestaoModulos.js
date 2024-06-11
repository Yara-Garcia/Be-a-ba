//import { confirmarExclusaoUsuario } from './deletarUsuario.js';

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
            console.log(modules)

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
                        const modulesMap = new Map(); // Mapa para armazenar modulos por ID

                        modules.forEach(module => modulesMap.set(module.id_modulo, module.nome_modulo));

                        modules.sort((a, b) => a.nome_modulo.localeCompare(b.nome_modulo));

                        const tableBody = document.querySelector('table.table-hover tbody'); // Seleciona o corpo da tabela

                        tableBody.innerHTML = ''; // Limpa o conteúdo da tabela

                        modules.forEach(module => {
                            const tableRow = document.createElement('tr');

                            const thNome = document.createElement('th');
                            thNome.scope = "row";
                            thNome.className = "col-name";
                            thNome.id = "row";
                            thNome.textContent = module.nome_modulo;

                            thNome.setAttribute('module-id', module.id_modulo);

                            const descricao = modulesMap.get(module.descricao);
                            const tdDescricao = document.createElement('td');
                            tdDescricao.className = "col-description";
                            tdDescricao.textContent = descricao ? descricao : '';

                            const tdAcoes = document.createElement('td');
                            tdAcoes.class = "col-actions";

                            const editarIcon = criarSvgIcone('editar', `editarModulos.html?id_modulo=${module.id_modulo}`);
                            const deletarIcon = criarSvgIcone('deletar', 'gestaoModulos.html');
                            deletarIcon.setAttribute('module-id', module.id_modulo); // Armazena o id como um atributo do ícone de exclusão

                            /* deletarIcon.addEventListener('click', function (event) {
                                 event.preventDefault();
                                 const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                                  modal.show();
 
                                 const moduleId = this.getAttribute('module-id');
                                 confirmarExclusaoModulo(moduleId);
                             });*/

                            editarIcon.setAttribute('data-bs-toggle', 'tooltip');
                            editarIcon.setAttribute('data-placement', 'top');
                            editarIcon.setAttribute('title', 'Editar');
                            deletarIcon.setAttribute('data-bs-toggle', 'tooltip');
                            deletarIcon.setAttribute('data-placement', 'top');
                            deletarIcon.setAttribute('title', 'Excluir');

                            // Adiciona os ícones de edição e exclusão à célula de ações
                            tdAcoes.appendChild(editarIcon);
                            tdAcoes.appendChild(document.createTextNode(' ')); // Adiciona um espaço entre os ícones
                            tdAcoes.appendChild(deletarIcon);

                            // Adiciona a linha com o nome do usuário e as ações à tabela
                            tableRow.appendChild(thNome);
                            tableRow.appendChild(tdDescricao);
                            tableRow.appendChild(tdAcoes);

                            // Adiciona a linha completa à tabela
                            tableBody.appendChild(tableRow);
                        });

                        // Barra de pesquisa
                        const searchInput = document.getElementById('search-focus');
                        const tabelaModulos = document.querySelector('.main-content table');

                        searchInput.addEventListener('input', function () {
                            const filtro = removerAcentos(this.value.toLowerCase()); // Normaliza e converte para minúsculas
                            filtrarTabela(filtro);
                        });

                        function removerAcentos(texto) {
                            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        }

                        function filtrarTabela(filtro) {
                            const linhas = tabelaModulos.querySelectorAll('tbody tr');
                            linhas.forEach(linha => {
                                const nomeModulo = removerAcentos(linha.querySelector('.col-name').textContent.toLowerCase()); // Normaliza e converte para minúsculas
                                const descricao = removerAcentos(linha.querySelector('.col-description').textContent.toLowerCase()); // Normaliza e converte para minúsculas
                                if (nomeModulo.includes(filtro) || descricao.includes(filtro)) {
                                    linha.style.display = 'table-row';
                                } else {
                                    linha.style.display = 'none';
                                }
                            });
                        }

                    } else {
                        console.error('Erro ao buscar módulos:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

function criarSvgIcone(tipoIcone, url) {
    const svgString = obterSvgString(tipoIcone);
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
    const svgIcon = svgDocument.documentElement;

    // Cria um link e adiciona o ícone SVG dentro dele
    const link = document.createElement('a');
    link.href = url;
    link.appendChild(svgIcon);

    return link;
}

function obterSvgString(tipoIcone) {
    if (tipoIcone === 'editar') {
        return `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
    class="bi bi-pencil-square" viewBox="0 0 16 16">
    <path
        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    <path fill-rule="evenodd"
        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
</svg>
`;
    } else if (tipoIcone === 'deletar') {
        return `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
    class="bi bi-trash" viewBox="0 0 16 16">
    <path
        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
    <path
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
</svg>
`;
    } else {
        console.warn('Tipo de ícone não suportado:', tipoIcone);
        return '';
    }
}
