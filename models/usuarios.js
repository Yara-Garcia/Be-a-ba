const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

// Define o modelo 'Usuario'
const Usuario = sequelize.define('Usuario', {
    // Atributos do modelo
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define como chave primária
        autoIncrement: true // Define auto-incremento se necessário
    },
    nome_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }
}, {
    // Opções do modelo
    tableName: 'usuarios',
    schema: 'BÊ-á-Bá Oficial', // Especifica o schema
    timestamps: true, // Sequelize adiciona automaticamente os campos createdAt e updatedAt
    createdAt: 'data_criacao', // Nome da coluna existente para data de criação
    updatedAt: 'data_atualizacao', // Nome da coluna existente para data de atualização
    id: false
});

// Exporta o modelo
module.exports = Usuario;