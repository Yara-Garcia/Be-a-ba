const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

const PerfilModulo = sequelize.define('PerfilModulo', {
    // Atributos do modelo
    id_associacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Define como chave primária
        autoIncrement: true // Define auto-incremento se necessário
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'perfis',
            key: 'id_perfil'
        }
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modulos',
            key: 'id_modulo'
        }
    }
}, {
    // Opções do modelo
    tableName: 'perfil_modulo',
    schema: 'BÊ-á-Bá Oficial', // Especifica o schema
    timestamps: false, // Sequelize adiciona automaticamente os campos createdAt e updatedAt
});

// Exporta o modelo
module.exports = PerfilModulo;