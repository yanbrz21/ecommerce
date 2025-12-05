const Cliente = require('./Cliente')
const Pedido = require('./Pedido')
const PedidoItem = require('./PedidoItem')
const Produto = require('./Produto')
const Estoque = require('./Estoque')
const Endereco = require('./Endereco')
const { Cart, CartItem } = require('./Carrinho')

Cliente.hasMany(Pedido, { foreignKey: 'idCliente', as: 'pedidos', onDelete: 'CASCADE' })
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' })

Pedido.hasMany(PedidoItem, { foreignKey: 'idPedido', as: 'itens', onDelete: 'CASCADE' })
PedidoItem.belongsTo(Pedido, { foreignKey: 'idPedido', as: 'pedido' })

Produto.hasMany(PedidoItem, { foreignKey: 'idProduto', as: 'itensPedido' })
PedidoItem.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produto' })

Estoque.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produto' })
Produto.hasOne(Estoque, { foreignKey: 'idProduto', as: 'estoqueProduto' })

Cliente.hasMany(Endereco, { foreignKey: 'idCliente', as: 'enderecos', onDelete: 'CASCADE' })
Endereco.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' })

Cart.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' })
Cliente.hasMany(Cart, { foreignKey: 'idCliente', as: 'carts', onDelete: 'CASCADE' })

Cart.hasMany(CartItem, { foreignKey: 'idCart', as: 'items', onDelete: 'CASCADE' })
CartItem.belongsTo(Cart, { foreignKey: 'idCart', as: 'cart' })

Produto.hasMany(CartItem, { foreignKey: 'idProduto', as: 'itensCarrinho' })
CartItem.belongsTo(Produto, { foreignKey: 'idProduto', as: 'produto' })

module.exports = { Cliente, Pedido, PedidoItem, Produto, Estoque, Endereco }
