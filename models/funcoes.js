const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const Funcao = sequelize.define('Funcao', {
    // Atributos do modelo
    id_funcao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define como chave primária
        autoIncrement: true // Define auto-incremento se necessário
    },
    nome_funcao: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Opções do modelo
    tableName: 'funcoes',
    schema: 'BÊ-á-Bá Oficial', // Especifica o schema
    timestamps: true, // Sequelize adiciona automaticamente os campos createdAt e updatedAt
    createdAt: 'data_criacao', // Nome da coluna existente para data de criação
    updatedAt: 'data_atualizacao', // Nome da coluna existente para data de atualização
    id: false
});

// Exporta o modelo
module.exports = Funcao;