function carregarInformacoesUsuario(userId) {
    fetch(`http://localhost:3000/user/${userId}`, {
        method: 'GET'

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

            // Carregar a senha, mas manter o campo bloqueado para edição
            const campoSenha = document.getElementById('senha');
            campoSenha.value = userData.senha;
            campoSenha.setAttribute('readonly', true);

            // Definir o perfil selecionado no dropdown
            document.getElementById('associar-perfil').value = userData.id_perfil;
        })
        .catch(error => {
            console.error('Erro ao carregar informações do usuário:', error);
            alert('Erro ao carregar informações do usuário');
        });
}

// Verificar se estamos editando um usuário (por exemplo, se houver um ID de usuário na URL)
const url = new URL(window.location.href);
console.log("URL completa:", url.href);
const userId = url.searchParams.get('id_usuario');
console.log(userId)



// Se houver um ID de usuário na URL, carregar as informações do usuário
if (userId) {
    carregarInformacoesUsuario(userId);
}


fetch('http://localhost:3000/profiles', {
    method: 'GET'
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
            const profiles = data.profiles; // Não é necessário usar JSON.parse(data) pois data já é um objeto JSON

            // Populando o select de perfis
            const selectPerfil = document.getElementById('associar-perfil');
            selectPerfil.innerHTML = ''; // Limpar opções anteriores

            profiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile.id_perfil;
                option.textContent = profile.nome_perfil;

                selectPerfil.appendChild(option);
            });
        } else {
            console.error('Erro ao buscar perfis:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeUsuario = document.getElementById('nome-usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const matricula = document.getElementById('matricula').value;
    const idPerfil = document.getElementById('associar-perfil').value;

    const dadosUsuario = {
        nome_usuario: nomeUsuario,
        email: email,
        senha: senha,
        matricula: matricula,
        id_perfil: idPerfil
    };

    fetch(`http://localhost:3000/user/${userId}`, {
        method: 'PUT',
        headers: {
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