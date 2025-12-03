const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Endereco = db.define('Endereco', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  idCliente: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logradouro: DataTypes.STRING,
  bairro: DataTypes.STRING,
  localidade: DataTypes.STRING,
  uf: DataTypes.STRING
}, {
  timestamps: false,
  tableName: 'enderecos'
})

module.exports = Endereco
