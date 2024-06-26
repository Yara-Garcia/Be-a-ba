const token = localStorage.getItem('token');

export function confirmarExclusaoUsuario(userId) {
    document.getElementById('confirmarExclusaoBtn').addEventListener('click', function () {
        fetch(`http://localhost:3000/user/${userId}`, {
            method: 'DELETE',
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
                if (data.success) {
                    alert('Usuário excluído com sucesso!');
                    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                    modal.hide();
                    window.location.reload();
                } else {
                    console.error('Erro:', data.message);
                    alert('Erro ao excluir usuário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir usuário: ' + error.message);
            });
    })
}
