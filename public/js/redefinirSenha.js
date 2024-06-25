document.getElementById('recuperar-senha-container').addEventListener('submit', async function (event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    console.log(email)


    try {
        const response = await fetch('http://localhost:3000/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        console.log(email)


        const data = await response.json();
        console.log(data);
        alert(data.message);

        document.getElementById('email').value = '';

        console.log('tudo certo por aqui')

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Ocorreu um erro ao enviar o email. Por favor, tente novamente.');
    }
});