const token = localStorage.getItem('token');

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
            console.log(userData)
            document.getElementById('nome-usuario').value = userData.nome_usuario;
            document.getElementById('email').value = userData.email;
            document.getElementById('matricula').value = userData.matricula;
            document.getElementById('tipo-usuario').value = userData.tipo_usuario;

            // Carregar a senha, mas manter o campo bloqueado para edição
            const campoSenha = document.getElementById('senha');
            campoSenha.value = userData.senha;
            campoSenha.setAttribute('readonly', true);

            document.getElementById('associar-perfil').value = userData.id_perfil;

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

                .then(data => {
                    console.log(data)
                    if (data.success) {
                        const profiles = data.profiles;

                        // Populando o select de perfis
                        const selectPerfil = document.getElementById('associar-perfil');
                        selectPerfil.innerHTML = ''; // Limpar opções anteriores

                        let primeiroPerfilSelecionado = false;

                        profiles.forEach(profile => {
                            const option = document.createElement('option');
                            option.value = profile.id_perfil;
                            option.textContent = profile.nome_perfil;

                            // Verificar se este perfil é o mesmo que está associado ao usuário
                            if (userData.id_perfil === profile.id_perfil && !primeiroPerfilSelecionado) {
                                option.selected = true;
                                primeiroPerfilSelecionado = true;
                            }

                            selectPerfil.appendChild(option);
                        });
                    } else {
                        console.error('Erro ao buscar perfis:', data.message);
                    }
                })
        })
        .catch(error => {
            console.error('Erro ao carregar informações do usuário:', error);
            alert('Erro ao carregar informações do usuário');
        });
}

// Verificar se estamos editando um usuário (por exemplo, se houver um ID de usuário na URL)
const url = new URL(window.location.href);
const userId = url.searchParams.get('id_usuario');

if (userId) {
    carregarInformacoesUsuario(userId);
}

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoUsuarios.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeUsuario = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const matricula = document.getElementById('matricula').value;
    const idPerfil = document.getElementById('associar-perfil').value;
    const tipoUsuario = document.getElementById('tipo-usuario').value;

    const dadosUsuario = {
        nome_usuario: nomeUsuario,
        email: email,
        senha: senha,
        matricula: matricula,
        id_perfil: idPerfil,
        tipo_usuario: tipoUsuario
    };

    fetch(`http://localhost:3000/user/${userId}`, {
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