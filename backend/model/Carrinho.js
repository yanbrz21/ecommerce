const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const Cliente = require('./Cliente');
const Produto = require('./Produto');

const Cart = db.define('Cart', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  idCliente: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active'
  }
}, {
  tableName: 'carts',
  timestamps: true
});

const CartItem = db.define('CartItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  idCart: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Cart,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  idProduto: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Produto,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  quantidade: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 1,
    allowNull: false
  }
}, {
  tableName: 'cart_items',
  timestamps: true
});

// Relações
Cart.hasMany(CartItem, { foreignKey: 'idCart' });
CartItem.belongsTo(Cart, { foreignKey: 'idCart' });

Produto.hasMany(CartItem, { foreignKey: 'idProduto' });
CartItem.belongsTo(Produto, { foreignKey: 'idProduto' });

module.exports = { Cart, CartItem };
