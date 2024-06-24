document.getElementById('redefinir-senha-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3000/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log(data);
        alert(data.message);

        document.getElementById('email').value = '';

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Ocorreu um erro ao enviar o email. Por favor, tente novamente.');
    }
});