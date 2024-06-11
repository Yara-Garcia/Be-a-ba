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

    fetch('http://localhost:3000/user', {
        method: 'POST',
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
                alert('Cadastro realizado com sucesso!');
                window.location.href = '../html/gestaoUsuarios.html';
            } else {
                console.log('Data:', data.message)
                alert('Falha no cadastro: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha no cadastro: ' + error.message);
        });
});