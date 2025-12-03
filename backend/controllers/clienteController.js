const { Op } = require('sequelize')
const Cliente = require('../model/Cliente')
const Endereco = require('../model/Endereco')
const { hashPassword } = require('../utils/hash')
const axios = require('axios')

function validarCpf(cpf) {

    cpf = cpf.replace(/\D/g, '')
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

    let soma = 0
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i)
    let dig1 = 11 - (soma % 11)
    if (dig1 > 9) dig1 = 0

    soma = 0
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i)
    let dig2 = 11 - (soma % 11)
    if (dig2 > 9) dig2 = 0

    return dig1 === parseInt(cpf[9]) && dig2 === parseInt(cpf[10])
}

async function createCliente(req, res) {
    try {
        const { nome, email, senha, telefone, cpf, cep } = req.body

        if (!nome || !email || !senha || !telefone || !cpf || !cep)
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' })

        if (!validarCpf(cpf))
            return res.status(400).json({ message: 'CPF inválido' })

        const exists = await Cliente.findOne({ where: { email } })
        if (exists) return res.status(409).json({ message: 'Email já cadastrado' })
        const existsCpf = await Cliente.findOne({ where: { cpf } })
        if (existsCpf) return res.status(409).json({ message: 'CPF já utilizado' })
            
            
        const viaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        if (viaCep.data.erro) {return res.status(400).json({ message: 'CEP inválido' })}
        
        const hashed = await hashPassword(senha)

        const cliente = await Cliente.create({
            nome,
            email,
            senha: hashed,
            telefone,
            cpf,
            role: 'user'
        })


        await Endereco.create({
            idCliente: cliente.id,
            cep,
            logradouro: viaCep.data.logradouro || '',
            bairro: viaCep.data.bairro || '',
            localidade: viaCep.data.localidade || '',
            uf: viaCep.data.uf || ''
        })

        const { senha: _, ...clienteSemSenha } = cliente.toJSON()
        res.status(201).json(clienteSemSenha)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao criar cliente' })
    }
}

async function getAllClientes(req, res) {
    try {
        const clientes = await Cliente.findAll({ attributes: { exclude: ['senha'] } })
        res.json(clientes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao buscar clientes' })
    }
}

async function getClienteById(req, res) {
    try {
        const { id } = req.params
        const cliente = await Cliente.findByPk(id, { attributes: { exclude: ['senha'] } })
        if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' })
        res.json(cliente)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao buscar cliente' })
    }
}

async function getClienteByName(req, res) {
    try {
        const { nome } = req.query
        if (!nome) return res.status(400).json({ message: 'Parâmetro nome é obrigatório' })

        const clientes = await Cliente.findAll({
            where: { nome: { [Op.like]: `%${nome}%` } },
            attributes: { exclude: ['senha'] }
        })

        res.json(clientes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao buscar cliente por nome' })
    }
}

async function updateCliente(req, res) {
    try {
        const { id } = req.params
        const { nome, email, telefone, cpf, role } = req.body
        const cliente = await Cliente.findByPk(id)
        if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' })

        if (cpf && !validarCpf(cpf)) return res.status(400).json({ message: 'CPF inválido' })

        await cliente.update({ nome, email, telefone, cpf, role })
        res.json({ message: 'Atualizado', cliente })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao atualizar cliente' })
    }
}

async function deleteCliente(req, res) {
    try {
        const { id } = req.params
        const cliente = await Cliente.findByPk(id)
        if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' })

        await cliente.destroy()
        res.json({ message: 'Cliente deletado' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao deletar cliente' })
    }
}

module.exports = { createCliente, getAllClientes, getClienteById, getClienteByName, updateCliente, deleteCliente }
