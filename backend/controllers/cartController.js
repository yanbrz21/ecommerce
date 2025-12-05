const { Cart, CartItem } = require('../model/Carrinho')
const Produto = require('../model/Produto')

async function addToCart(req, res) {
    try {
        const { idProduto } = req.body
        const idCliente = req.user.id

        if (!idProduto) return res.status(400).json({ message: 'idProduto é obrigatório' })

        let cart = await Cart.findOne({
            where: { idCliente, status: 'active' }
        })

        if (!cart) {
            cart = await Cart.create({ idCliente, status: 'active' })
        }

        let item = await CartItem.findOne({
            where: { idCart: cart.id, idProduto }
        })

        if (item) {
            item.quantidade += 1
            await item.save()
        } else {
            await CartItem.create({
                idCart: cart.id,
                idProduto,
                quantidade: 1
            })
        }

        res.status(200).json({ message: 'Produto adicionado ao carrinho' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao adicionar ao carrinho' })
    }
}

async function updateQuantity(req, res) {
    try {
        const { idProduto, quantidade } = req.body
        const idCliente = req.user.id

        let cart = await Cart.findOne({
            where: { idCliente, status: 'active' }
        })

        if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado' })

        let item = await CartItem.findOne({
            where: { idCart: cart.id, idProduto }
        })

        if (!item) return res.status(404).json({ message: 'Item não encontrado' })

        if (quantidade <= 0) {
            await item.destroy()
            return res.json({ message: 'Item removido' })
        }

        item.quantidade = quantidade
        await item.save()

        res.json({ message: 'Quantidade atualizada' })
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar quantidade' })
    }
}


async function getCart(req, res) {
    try {
        const idCliente = req.user.id

        const cart = await Cart.findOne({
            where: { idCliente, status: 'active' },
            include: [{
                model: CartItem,
                include: [{ model: Produto }]
            }]
        })

        if (!cart) return res.json([])

        res.json(cart.CartItems)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao buscar carrinho' })
    }
}

module.exports = { addToCart, getCart, updateQuantity }
