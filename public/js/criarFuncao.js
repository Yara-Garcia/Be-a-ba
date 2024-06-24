const token = localStorage.getItem('token');

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoFuncoes.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();

    const nomeFuncao = document.getElementById('nome-funcao').value;
    const descricao = document.getElementById('descricao').value;

    const dadosFuncao = {
        nome_funcao: nomeFuncao,
        descricao: descricao
    };

    fetch('http://localhost:3000/function', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosFuncao)
    })
        .then(response => {
            if (!response.ok) {
                const error = response.statusText;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Função criada com sucesso!');
                window.location.href = '../html/gestaoFuncoes.html';
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