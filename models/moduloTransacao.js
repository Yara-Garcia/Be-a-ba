const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Modulo = require('../models/modulos');
const Transacao = require('../models/transacoes');

const ModuloTransacao = sequelize.define('ModuloTransacao', {
    id_associacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modulos',
            key: 'id_modulo'
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
    tableName: 'modulo_transacao',
    schema: 'BÊ-á-Bá Oficial',
    timestamps: false
});

//Definindo os relacionamentos
Modulo.belongsToMany(Transacao, {
    through: ModuloTransacao,
    foreignKey: 'id_modulo',
    otherKey: 'id_transacao'
});
Transacao.belongsToMany(Modulo, {
    through: ModuloTransacao,
    foreignKey: 'id_transacao',
    otherKey: 'id_modulo'
});

// Exporta o modelo
module.exports = ModuloTransacao;