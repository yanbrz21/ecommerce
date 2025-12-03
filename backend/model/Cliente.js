const { DataTypes } = require('sequelize')
const db = require('../db/conn')


const Cliente = db.define('Cliente', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefone: {
        type: DataTypes.STRING
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {timestamps: false, tableName: 'clientes'})


module.exports = Cliente