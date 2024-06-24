const token = localStorage.getItem('token');

export function confirmarExclusaoFuncao(functionId) {
    document.getElementById('confirmarExclusaoBtn').addEventListener('click', function () {
        fetch(`http://localhost:3000/function/${functionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => {
                if (!response.ok) {
                    const error = response.statusText;
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Função excluída com sucesso!');
                    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                    modal.hide();
                    window.location.reload();
                } else {
                    console.error('Erro:', data.message);
                    alert('Erro ao excluir função: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir função: ' + error.message);
            });
    })
}
