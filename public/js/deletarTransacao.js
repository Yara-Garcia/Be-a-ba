export function confirmarExclusaoTransacao(transactionId) {
    document.getElementById('confirmarExclusaoBtn').addEventListener('click', function () {
        fetch(`http://localhost:3000/transaction/${transactionId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    const error = response.statusText;
                    console.log(error)
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Transação excluída com sucesso!');
                    const modal = new bootstrap.Modal(document.getElementById('confirmarExclusaoModal'));
                    modal.hide();
                    window.location.reload();
                } else {
                    console.error('Erro:', data.message);
                    alert('Erro ao excluir transação: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao excluir transação: ' + error.message);
            });
    })
}
