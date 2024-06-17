const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Perfil = require('../models/perfis');
const Transacao = require('../models/transacoes');

const PerfilTransacao = sequelize.define('PerfilTransacao', {
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
    id_transacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transacoes',
            key: 'id_transacao'
        }
    }
}, {
    // Opções do modelo
    tableName: 'perfil_transacao',
    schema: 'BÊ-á-Bá Oficial', // Especifica o schema
    timestamps: false, // Sequelize adiciona automaticamente os campos createdAt e updatedAt
});

Perfil.belongsToMany(Transacao, {
    through: PerfilTransacao,
    foreignKey: 'id_perfil',
    otherKey: 'id_transacao'
});
Transacao.belongsToMany(Perfil, {
    through: PerfilTransacao,
    foreignKey: 'id_transacao',
    otherKey: 'id_perfil'
});

// Exporta o modelo
module.exports = PerfilTransacao;