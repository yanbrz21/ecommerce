const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('Produto', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    estoque: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imagem: {
        type: DataTypes.BLOB('long'),
    }
}, {timestamps: false, tableName: 'produtos'})

module.exports = Produto