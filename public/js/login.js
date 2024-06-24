document.getElementById('login-container').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    const dadosLogin = {
        usuario: usuario,
        senha: senha
    };

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '../html/gestaoUsuarios.html';
            } else {
                alert('Login falhou: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
});
