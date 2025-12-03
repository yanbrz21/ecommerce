// Defina relacionamentos aqui
const Cliente = require('./Cliente')
const Pedido = require('./Pedido')
const Produto = require('./Produto')
const Estoque = require('./Estoque')
const Endereco = require('./Endereco')

// Cliente 1 - N Pedidos
Cliente.hasMany(Pedido, { foreignKey: 'clienteId', as: 'pedidos', onDelete: 'CASCADE' })
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' })

// Produto 1 - N Pedidos
Produto.hasMany(Pedido, { foreignKey: 'produtoId', as: 'pedidos' })
Pedido.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' })

Estoque.belongsTo(Produto, {foreignKey: 'idProduto', as: 'produto'})
Produto.hasOne(Estoque, {foreignKey: 'idProduto', as: 'estoqueProduto'})

Cliente.hasMany(Endereco, { foreignKey: 'idCliente', as: 'enderecos', onDelete: 'CASCADE' })
Endereco.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' })

module.exports = { Cliente, Pedido, Produto, Estoque, Endereco }