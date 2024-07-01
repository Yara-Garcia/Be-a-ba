const token = localStorage.getItem('token');

const decoded = parseJwt(token);

if (decoded && decoded.id_usuario) {
    const userId = decoded.id_usuario;


    function carregarInformacoesUsuario(userId) {
        fetch(`http://localhost:3000/user/${userId}`, {
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
                const userData = data.user;
                document.getElementById('nome-usuario').value = userData.nome_usuario;
                document.getElementById('email').value = userData.email;
                document.getElementById('matricula').value = userData.matricula;

            })
            .catch(error => {
                console.error('Erro ao carregar informações do usuário:', error);
                alert('Erro ao carregar informações do usuário');
            });
    }

    if (userId) {
        carregarInformacoesUsuario(userId);
    }
}

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoUsuarios.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeUsuario = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email').value;
    const matricula = document.getElementById('matricula').value;

    const dadosUsuario = {
        nome_usuario: nomeUsuario,
        email: email,
        matricula: matricula

    };

    fetch(`http://localhost:3000/user`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
    })
        .then(response => {
            if (!response.ok) {
                const error = response.statusText;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Atualização de cadastro realizada com sucesso!');
                window.location.href = '../html/gestaoUsuarios.html';
            } else {
                console.log('Data:', data.message)
                alert('Falha na edição: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha na edição: ' + error.message);
        });
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
