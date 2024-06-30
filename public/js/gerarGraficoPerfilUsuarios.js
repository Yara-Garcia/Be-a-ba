document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../html/login.html';
        return;
    }

    async function fetchData() {
        try {
            const decoded = parseJwt(token);

            if (decoded && decoded.tipo_usuario) {
                const tipoUsuario = decoded.tipo_usuario;
                const response = await fetch('http://localhost:3000/usersByProfiles', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                if (response.ok) {
                    const result = await response.json();
                    return result.data;
                } else {
                    console.error('Erro na requisição:', response.status);
                    return [];
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            return [];
        }
    }

    // Função para criar o gráfico
    async function createPieChart() {
        const data = await fetchData();
        if (data.length > 0) {
            const ctx = document.getElementById('graficoPerfilUsuario').getContext('2d');
            const labels = data.map(item => item.perfil);
            const quantities = data.map(item => item.quantidade);

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Quantidade de Usuários',
                        data: quantities,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)', // verde claro semitransparente
                            'rgba(54, 162, 235, 0.2)', // azul claro semitransparente
                            'rgba(255, 206, 86, 0.2)', // amarelo claro semitransparente
                            'rgba(153, 102, 255, 0.2)', // roxo claro semitransparente
                            'rgba(255, 99, 132, 0.2)'  // vermelho claro semitransparente
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)', // verde claro sólido
                            'rgba(54, 162, 235, 1)', // azul claro sólido
                            'rgba(255, 206, 86, 1)', // amarelo claro sólido
                            'rgba(153, 102, 255, 1)', // roxo claro sólido
                            'rgba(255, 99, 132, 1)'  // vermelho claro sólido
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Permitir que o gráfico não mantenha a proporção
                    aspectRatio: 1, // Ajuste a proporção do gráfico (1 significa largura igual a altura)
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Chama a função para criar o gráfico
    createPieChart();
});

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}




