const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Admin = db.define('Admin', {
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
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { 
    timestamps: false,
    tableName: 'admins'
})

module.exports = Admin
