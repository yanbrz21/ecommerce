const Pedido = require('../model/Pedido');


async function createPedido(req, res) {
    try {
        const { idCliente, idProduto, quantidade, valorTotal } = req.body;
        if (!idCliente || !idProduto || !quantidade || !valorTotal) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        
        const pedido = await Pedido.create({ idCliente, idProduto, quantidade, valorTotal });
        res.status(201).json(pedido);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar pedido' });
    }
}


async function getAllPedidos(req, res) {
    try {
        const pedidos = await Pedido.findAll();
        res.json(pedidos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
}


async function getPedidoById(req, res) {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
}


async function updatePedido(req, res) {
    try {
        const { id } = req.params;
        const { idCliente, idProduto, quantidade, valorTotal } = req.body;
        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });


        await pedido.update({ idCliente, idProduto, quantidade, valorTotal });
        res.json({ message: 'Atualizado', pedido });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar pedido' });
    }
}


async function deletePedido(req, res) {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });


        await pedido.destroy();
        res.json({ message: 'Pedido deletado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao deletar pedido' });
    }
}


module.exports = { createPedido, getAllPedidos, getPedidoById, updatePedido, deletePedido };