const Pedido = require('../model/Pedido')
const PedidoItem = require('../model/PedidoItem')
const Produto = require('../model/Produto')
const { Cart, CartItem } = require('../model/Carrinho')

// ------------------- CHECKOUT -------------------
async function checkout(req, res) {
  try {
    const { idCliente, valorTotal, metodoPagamento, itens } = req.body

    if (!idCliente || !valorTotal || !metodoPagamento || !itens?.length) {
      return res.status(400).json({ message: 'Dados incompletos' })
    }

    // Verificar estoque
    for (const item of itens) {
      const produto = await Produto.findByPk(item.idProduto)
      if (!produto) return res.status(404).json({ message: `Produto ID ${item.idProduto} não encontrado` })
      if (item.quantidade > produto.estoque) {
        return res.status(400).json({ message: `Estoque insuficiente para o produto ${produto.nome}` })
      }
    }

    const pedido = await Pedido.create({ idCliente, valorTotal, metodoPagamento })

    const pedidoItens = []
    for (const item of itens) {
      pedidoItens.push({
        idPedido: pedido.id,
        idProduto: item.idProduto,
        quantidade: item.quantidade,
        valorUnit: item.valorUnit
      })

      // Diminuir estoque
      const produto = await Produto.findByPk(item.idProduto)
      await produto.update({ estoque: produto.estoque - item.quantidade })
    }

    await PedidoItem.bulkCreate(pedidoItens)

    const cart = await Cart.findOne({ where: { idCliente, status: 'active' } })
    if (cart) {
      await CartItem.destroy({ where: { idCart: cart.id } })
      cart.status = 'completed'
      await cart.save()
    }

    res.json({ message: 'Pedido criado com sucesso', pedidoId: pedido.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro no checkout' })
  }
}

// ------------------- GET PEDIDOS -------------------
async function getPedidosByUsuario(req, res) {
  try {
    const { idCliente } = req.params

    const pedidos = await Pedido.findAll({
      where: { idCliente },
      include: [
        { model: PedidoItem, as: 'itens', include: [{ model: Produto, as: 'produto', attributes: ['nome', 'imagem', 'valor'] }] }
      ],
      order: [['createdAt', 'DESC']]
    })

    const formattedPedidos = pedidos.map(pedido => ({
      id: pedido.id,
      valorTotal: pedido.valorTotal,
      metodoPagamento: pedido.metodoPagamento,
      itens: pedido.itens.map(item => ({
        nome: item.produto.nome,
        quantidade: item.quantidade,
        valorUnit: item.valorUnit
      }))
    }))

    res.json(formattedPedidos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao buscar pedidos do usuário' })
  }
}

async function getTodosPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: PedidoItem, as: 'itens', include: [{ model: Produto, as: 'produto', attributes: ['nome', 'imagem', 'valor'] }] }
      ],
      order: [['createdAt', 'DESC']]
    })

    const formattedPedidos = pedidos.map(pedido => ({
      id: pedido.id,
      idCliente: pedido.idCliente,
      valorTotal: pedido.valorTotal,
      metodoPagamento: pedido.metodoPagamento,
      itens: pedido.itens.map(item => ({
        nome: item.produto.nome,
        quantidade: item.quantidade,
        valorUnit: item.valorUnit
      }))
    }))

    res.json(formattedPedidos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao buscar todos os pedidos' })
  }
}

// ------------------- EDITAR PEDIDO -------------------
async function updatePedido(req, res) {
  try {
    const { id } = req.params
    const { valorTotal, metodoPagamento, status } = req.body
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' })

    await pedido.update({ valorTotal, metodoPagamento, status })
    res.json({ message: 'Pedido atualizado com sucesso', pedido })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao atualizar pedido' })
  }
}

// ------------------- DELETAR PEDIDO -------------------
async function deletePedido(req, res) {
  try {
    const { id } = req.params
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' })

    await PedidoItem.destroy({ where: { idPedido: id } })
    await pedido.destroy()
    res.json({ message: 'Pedido deletado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erro ao deletar pedido' })
  }
}

// ------------------- RELAÇÕES -------------------
Pedido.hasMany(PedidoItem, { as: 'itens', foreignKey: 'idPedido' })
PedidoItem.belongsTo(Pedido, { foreignKey: 'idPedido' })
PedidoItem.belongsTo(Produto, { as: 'produto', foreignKey: 'idProduto' })
Produto.hasMany(PedidoItem, { foreignKey: 'idProduto' })

module.exports = { checkout, getPedidosByUsuario, getTodosPedidos, updatePedido, deletePedido }
