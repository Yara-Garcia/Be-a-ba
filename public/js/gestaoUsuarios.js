document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../html/login.html';
        return;
    }

    try {
        const decoded = parseJwt(token);

        if (decoded && decoded.tipo_usuario) {
            const tipoUsuario = decoded.tipo_usuario;

            fetch('http://localhost:3000/users', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
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
                        const users = data.users;

                        fetch('http://localhost:3000/profiles', {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Falha na requisição: ' + response.statusText);
                                }
                                return response.json();
                            })
                            .then(profileData => {
                                if (profileData.success) {
                                    const profiles = profileData.profiles;
                                    const profilesMap = new Map();

                                    profiles.forEach(profile => profilesMap.set(profile.id_perfil, profile.nome_perfil));

                                    users.sort((a, b) => a.nome_usuario.localeCompare(b.nome_usuario));

                                    const tableBody = document.querySelector('table.table-hover tbody');
                                    tableBody.innerHTML = '';

                                    users.forEach(user => {
                                        const tableRow = document.createElement('tr');

                                        const tdNome = document.createElement('td');
                                        tdNome.scope = "row";
                                        tdNome.className = "col-name";
                                        tdNome.textContent = user.nome_usuario;
                                        tdNome.setAttribute('user-id', user.id_usuario);

                                        const profile = profilesMap.get(user.id_perfil);
                                        const tdPerfil = document.createElement('td');
                                        tdPerfil.className = "col-profile";
                                        tdPerfil.textContent = profile ? profile : '';

                                        const tdAcoes = document.createElement('td');
                                        tdAcoes.className = "col-actions";

                                        if (tipoUsuario === 'admin') {

                                            console.log('admin')
                                            const editarIcon = criarSvgIcone('editar', `editarUsuario.html?id_usuario=${user.id_usuario}`);
                                            const deletarIcon = criarSvgIcone('deletar', 'gestaoUsuarios.html');
                                            deletarIcon.setAttribute('user-id', user.id_usuario);

                                            deletarIcon.addEventListener('click', function (event) {
                                                event.preventDefault();
                                                const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                                                modal.show();

                                                const userId = this.getAttribute('user-id');
                                                confirmarExclusaoUsuario(userId);
                                            });

                                            editarIcon.setAttribute('data-bs-toggle', 'tooltip');
                                            editarIcon.setAttribute('data-placement', 'top');
                                            editarIcon.setAttribute('title', 'Editar');
                                            deletarIcon.setAttribute('data-bs-toggle', 'tooltip');
                                            deletarIcon.setAttribute('data-placement', 'top');
                                            deletarIcon.setAttribute('title', 'Excluir');

                                            tdAcoes.appendChild(editarIcon);
                                            tdAcoes.appendChild(document.createTextNode(' '));
                                            tdAcoes.appendChild(deletarIcon);
                                        }

                                        tableRow.appendChild(tdNome);
                                        tableRow.appendChild(tdPerfil);
                                        tableRow.appendChild(tdAcoes);

                                        tableBody.appendChild(tableRow);
                                    });

                                    const searchInput = document.getElementById('search-focus');
                                    const tabelaUsuarios = document.querySelector('.main-content table');

                                    searchInput.addEventListener('input', function () {
                                        const filtro = removerAcentos(this.value.toLowerCase());
                                        filtrarTabela(filtro);
                                    });

                                    function removerAcentos(texto) {
                                        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                    }

                                    function filtrarTabela(filtro) {
                                        const linhas = tabelaUsuarios.querySelectorAll('tbody tr');
                                        linhas.forEach(linha => {
                                            const nomeUsuario = removerAcentos(linha.querySelector('.col-name').textContent.toLowerCase());
                                            const perfilUsuario = removerAcentos(linha.querySelector('.col-profile').textContent.toLowerCase());
                                            if (nomeUsuario.includes(filtro) || perfilUsuario.includes(filtro)) {
                                                linha.style.display = 'table-row';
                                            } else {
                                                linha.style.display = 'none';
                                            }
                                        });
                                    }

                                } else {
                                    console.error('Erro ao buscar perfis:', profileData.message);
                                }
                            })
                            .catch(error => {
                                console.error('Erro ao buscar perfis:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar usuários:', error);
                });
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
    }
});

function criarSvgIcone(tipoIcone, url) {
    const svgString = obterSvgString(tipoIcone);
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgString, 'image/svg+xml');
    const svgIcon = svgDocument.documentElement;

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
        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
</svg>
`;
    } else {
        console.warn('Tipo de ícone não suportado:', tipoIcone);
        return '';
    }
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}
