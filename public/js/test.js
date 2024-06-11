// Armazena o token JWT no localStorage
localStorage.setItem('jwtToken', token);

// Faz a requisição para obter os perfis após armazenar o token
fetch('http://localhost:3000/profiles', {
    method: 'GET',
    headers: myHeaders
})
    .then(response => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        // Converte a resposta para JSON
        return response.json();
    })
    .then(data => {
        // A partir daqui, você pode acessar o token e processar os dados
        // Aqui você pode acessar o token armazenado no localStorage e usar em outras requisições
        const storedJwt = localStorage.getItem('jwtToken');
        const profiles = data; // Aqui você recebe os perfis retornados pela requisição

        // Restante do código para processar os perfis...
    })
    .catch(error => {
        console.error('Erro:', error);
    });