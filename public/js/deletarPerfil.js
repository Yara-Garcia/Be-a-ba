const token = localStorage.getItem('token');

export function confirmarExclusaoPerfil(perfilId) {
    document.getElementById('confirmarExclusaoBtn').addEventListener('click', function () {
        fetch(`http://localhost:3000/profile/${perfilId}`, {
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
                    alert('Perfil excluído com sucesso!');
                    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                    modal.hide();
                    window.location.reload();
                } else {
                    console.error('Erro:', data.message);
                    alert('Erro ao excluir perfil: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir perfil: ' + error.message);
            });
    })
}
