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
                const response = await fetch('http://localhost:3000/quantitatyData', {
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
    async function createBarChart() {
        const data = await fetchData();
        if (data) {
            const ctx = document.getElementById('graficoQuantidade').getContext('2d');
            const labels = Object.keys(data);
            const quantities = Object.values(data);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Quantidade',
                        data: quantities,
                        backgroundColor: [
                            'rgba(34,139,34, 0.5)',  // forest green
                            'rgba(128,0,128, 0.5)', // purple
                            'rgba(250,128,114, 0.5)', // salmon
                            'rgba(255,140,0, 0.5)'  // dark orange
                        ],
                        borderColor: [
                            'rgba(34,139,34, 1)',  // forest green
                            'rgba(128,0,128, 1)', // purple
                            'rgba(250,128,114, 1)', // salmon
                            'rgba(255,140,0, 1)'  // dark orange
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
                        },
                        title: {
                            display: true,
                            text: 'Quantidade de cada categoria',
                            font: {
                                size: 16
                            }
                        }
                    },

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
    // Chama a função para criar o gráfico
    createBarChart();

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




