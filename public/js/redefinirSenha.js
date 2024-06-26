document.getElementById('login-container').addEventListener('submit', async function (event) {
    event.preventDefault();

    let novaSenha = document.getElementById('nova-senha').value;
    let confirmarSenha = document.getElementById('confirmar-senha').value;

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem. Por favor, verifique.');
        return;
    }

    // Obtenha o token JWT da URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    try {
        const response = await fetch('http://localhost:3000/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, novaSenha })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Exibe o alerta apenas se a resposta for OK (status 200-299)
            document.getElementById('nova-senha').value = ''; // Limpa o campo de nova senha
            document.getElementById('confirmar-senha').value = ''; // Limpa o campo de confirmar senha
        } else {
            console.error('Erro ao alterar senha:', data.message); // Loga o erro no console do navegador
            alert('Ocorreu um erro ao alterar a senha. Por favor, tente novamente.');
        }

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        alert('Ocorreu um erro ao alterar a senha. Por favor, tente novamente.');
    }
});
