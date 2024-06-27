document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage

    if (!token) {
        window.location.href = '../html/login.html'; // Redireciona para a página de login se não houver token
        return; // Encerra a execução da função para evitar erros adicionais
    }

    try {
        const decoded = parseJwt(token);

        if (decoded && decoded.tipo_usuario) {
            const tipoUsuario = decoded.tipo_usuario;

            const btnCriar = document.querySelector('.btn.btn-success');

            if (tipoUsuario === 'admin') {
                btnCriar.style.display = 'inline-block'; // Mostra o botão para administradores
            } else {
                btnCriar.style.display = 'none'; // Esconde o botão para não administradores
            }

            // Selecionando os elementos da barra de navegação que devem ser modificados
            const navItems = document.querySelectorAll('.nav-item-gestao-usuarios, .nav-item-gestao-perfis, .nav-item-gestao-modulos, .nav-item-gestao-transacoes, .nav-item-gestao-funcoes, .nav-item, .dropdown-item');
            const colActions = document.querySelectorAll('.col-actions');


            // Mostra ou esconde os itens do menu dependendo do tipo de usuário
            navItems.forEach(item => {
                if (tipoUsuario === 'admin') {
                    item.classList.add('d-block'); // Mostra todos os itens para administradores
                } else {
                    if (item.classList.contains('nav-item-gestao-perfis')) {
                        item.classList.add('d-none'); // Esconde o item de gestão de perfis para não administradores
                    } else {
                        item.classList.add('d-block'); // Mostra os outros itens
                    }
                }
            });

            if (tipoUsuario !== 'admin') {
                colActions.forEach(col => {
                    col.style.display = 'none';
                });
            }

            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    localStorage.removeItem('token');
                    window.location.href = '../html/login.html';
                });
            }
        } else {
            console.error('Token inválido ou ausente.');
            // Trate adequadamente o caso de token inválido ou ausente
        }
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        // Trate adequadamente o erro de decodificação do token JWT
    }
});

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
