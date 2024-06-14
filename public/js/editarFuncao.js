function carregarInformacoesFuncao(functionId) {
    fetch(`http://localhost:3000/function/${functionId}`, {
        method: 'GET'

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const functionData = data.functionInfo;
            document.getElementById('nome-funcao').value = functionData.nome_funcao;
            document.getElementById('descricao').value = functionData.descricao;

        })
        .catch(error => {
            console.error('Erro ao carregar informações da função:', error);
            alert('Erro ao carregar informações da função');
        });
}

const url = new URL(window.location.href);
const functionId = url.searchParams.get('id_funcao');

if (functionId) {
    carregarInformacoesFuncao(functionId);
}

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

    fetch(`http://localhost:3000/function/${functionId}`, {
        method: 'PUT',
        headers: {
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
                alert('Edição de função realizada com sucesso!');
                window.location.href = '../html/gestaoFuncoes.html';
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