document.getElementById('recuperar-senha-container').addEventListener('submit', async function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3000/resetPasswordRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
            alert(data.message);
            document.getElementById('email').value = ''; // Limpa o campo de email após o envio
            window.location.href = '../html/login.html';
        } else {
            console.error('Erro ao enviar email:', data.message); // Loga o erro no console do navegador
            alert('Ocorreu um erro ao enviar o email. Por favor, tente novamente.');
        }

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Ocorreu um erro ao enviar o email. Por favor, tente novamente.');
    }
});
