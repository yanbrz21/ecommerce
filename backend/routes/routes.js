const express = require('express');
const clienteController = require('../controllers/clienteController');
const produtoController = require('../controllers/produtoController');
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');
const enderecoController = require('../controllers/enderecoController');
const authRoutes = require('./authRoutes');
const upload = require('../middleware/upload');

const router = express.Router();

// ------------------- Público -------------------
router.get('/clientes', clienteController.getAllClientes);
router.post('/clientes', clienteController.createCliente);

// Auth (agora totalmente separado)
router.use('/auth', authRoutes);

// ------------------- Produtos -------------------
router.get('/produtos', produtoController.getAllProdutos);
router.get('/produtos/id/:id', produtoController.getProdutoById);
router.get('/produtos/nome', produtoController.getProdutoByName);

router.post('/produtos', authMiddleware, upload.single('imagem'), produtoController.createProduto);
router.put('/produtos/:id', authMiddleware, upload.single('imagem'), produtoController.updateProduto);
router.delete('/produtos/:id', authMiddleware, produtoController.deleteProduto);

// ------------------- Endereços -------------------
router.post('/enderecos', authMiddleware, enderecoController.createEndereco);
router.get('/enderecos/cliente/:idCliente', authMiddleware, enderecoController.getEnderecosByCliente);
router.put('/enderecos/:id', authMiddleware, enderecoController.updateEndereco);
router.delete('/enderecos/:id', authMiddleware, enderecoController.deleteEndereco);

// ------------------- Clientes -------------------
router.get('/clientes/id/:id', authMiddleware, clienteController.getClienteById);
router.get('/clientes/nome/:nome', authMiddleware, clienteController.getClienteByName);
router.put('/clientes/:id', authMiddleware, clienteController.updateCliente);
router.delete('/clientes/:id', authMiddleware, clienteController.deleteCliente);

// ------------------- Pedidos -------------------
router.get('/pedidos', authMiddleware, pedidoController.getAllPedidos);
router.get('/pedidos/:id', authMiddleware, pedidoController.getPedidoById);
router.post('/pedidos', authMiddleware, pedidoController.createPedido);
router.put('/pedidos/:id', authMiddleware, pedidoController.updatePedido);
router.delete('/pedidos/:id', authMiddleware, pedidoController.deletePedido);

module.exports = router;
