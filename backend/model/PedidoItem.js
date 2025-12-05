const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const PedidoItem = db.define('PedidoItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  idPedido: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  idProduto: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, { tableName: 'pedidoItens' })

module.exports = PedidoItem
