const Endereco = require('../model/Endereco')
const Cliente = require('../model/Cliente')

async function buscarCep(cep) {
    const clean = cep.replace(/\D/g, '')
    const req = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const data = await req.json()
    if (data.erro) return null
    return data
}

async function createEndereco(req, res) {
    try {
        const { idCliente, cep } = req.body
        if (!idCliente || !cep) return res.status(400).json({ message: 'idCliente e cep são obrigatórios' })

        const cliente = await Cliente.findByPk(idCliente)
        if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' })

        const dados = await buscarCep(cep)
        if (!dados) return res.status(400).json({ message: 'CEP inválido' })

        const endereco = await Endereco.create({
            idCliente,
            cep: dados.cep
        })

        res.status(201).json(endereco)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao criar endereço' })
    }
}

async function getEnderecosByCliente(req, res) {
    try {
        const { idCliente } = req.params

        const enderecos = await Endereco.findAll({
            where: { idCliente }
        })

        res.json(enderecos)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao buscar endereços' })
    }
}

async function updateEndereco(req, res) {
    try {
        const { id } = req.params
        const { cep } = req.body

        const endereco = await Endereco.findByPk(id)
        if (!endereco) return res.status(404).json({ message: 'Endereço não encontrado' })

        if (cep) {
            const dados = await buscarCep(cep)
            if (!dados) return res.status(400).json({ message: 'CEP inválido' })
            endereco.cep = dados.cep
        }

        await endereco.save()
        res.json({ message: 'Atualizado', endereco })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao atualizar endereço' })
    }
}

async function deleteEndereco(req, res) {
    try {
        const { id } = req.params
        const endereco = await Endereco.findByPk(id)
        if (!endereco) return res.status(404).json({ message: 'Endereço não encontrado' })

        await endereco.destroy()
        res.json({ message: 'Endereço deletado' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao deletar endereço' })
    }
}

module.exports = { createEndereco, getEnderecosByCliente, updateEndereco, deleteEndereco }
