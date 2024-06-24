const token = localStorage.getItem('token');

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoModulos.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeModulo = document.getElementById('nome-modulo').value;
    const descricao = document.getElementById('descricao').value;

    const dadosModulo = {
        nome_modulo: nomeModulo,
        descricao: descricao
    };

    fetch('http://localhost:3000/module', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosModulo)
    })
        .then(response => {
            if (!response.ok) {
                const error = response.statusText;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Módulo criado com sucesso!');
                window.location.href = '../html/gestaoModulos.html';
            } else {
                console.log('Data:', data.message)
                alert('Falha na criação: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha na criação: ' + error.message);
        });
});