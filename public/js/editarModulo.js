function carregarInformacoesModulo(moduleId) {
    fetch(`http://localhost:3000/module/${moduleId}`, {
        method: 'GET'

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const moduleData = data.module;
            document.getElementById('nome-modulo').value = moduleData.nome_modulo;
            document.getElementById('descricao').value = moduleData.descricao;

        })
        .catch(error => {
            console.error('Erro ao carregar informações do módulo:', error);
            alert('Erro ao carregar informações do módulo');
        });
}

const url = new URL(window.location.href);
const moduleId = url.searchParams.get('id_modulo');

if (moduleId) {
    carregarInformacoesModulo(moduleId);
}

document.getElementById('btn-cancelar').addEventListener('click', function () {
    window.location.href = '../html/gestaoModulos.html';
});

document.getElementById('form-container').addEventListener('submit', function (event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeModulo = document.getElementById('nome-modulo').value;
    const descricao = document.getElementById('descricao').value;

    const dadosModulo = {
        nome_modulo: nomeModulo,
        descricao: descricao
    };

    fetch(`http://localhost:3000/module/${moduleId}`, {
        method: 'PUT',
        headers: {
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
                alert('Edição de módulo realizada com sucesso!');
                window.location.href = '../html/gestaoModulos.html';
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