const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    host: 'localhost', // ou o endereço IP ou URL do servidor do banco de dados
    port: 5432, // Porta padrão do PostgreSQL
    dialect: 'postgres', // Especifica que estamos usando o PostgreSQL
    pool: {
        max: 5, // Número máximo de conexões no pool
        min: 0, // Número mínimo de conexões no pool
        acquire: 30000, // O tempo máximo, em milissegundos, que o pool tentará obter uma conexão antes de lançar erro
        idle: 10000 // O tempo máximo, em milissegundos, que uma conexão pode estar ociosa antes de ser fechada
    },
    logging: false, // Desabilita a exibição de logs das queries no console
    define: {
        timestamps: true, // Adiciona os campos 'createdAt' e 'updatedAt' a todas as tabelas
        underscored: true, // Utiliza o padrão underscore (snake_case) para os nomes das colunas e tabelas
        freezeTableName: true // Evita que o Sequelize pluralize os nomes das tabelas
    },
    timezone: '+00:00' // Define o fuso horário para UTC
});

// Testar a conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão estabelecida com sucesso.');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

module.exports = sequelize;


