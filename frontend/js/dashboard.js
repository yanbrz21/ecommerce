const tabBtns = document.querySelectorAll('.tabBtn')
const tabContents = document.querySelectorAll('.tabContent')

tabBtns.forEach(btn => {
    btn.onclick = e => {
        e.preventDefault()
        tabBtns.forEach(b => b.classList.remove('active'))
        tabContents.forEach(c => c.classList.remove('active'))
        btn.classList.add('active')
        document.getElementById(btn.dataset.tab).classList.add('active')
    }
})

const productsGrid = document.getElementById('productsGrid')
const clientsList = document.getElementById('clientsList')
const ordersList = document.getElementById('ordersList')

const createBtns = document.querySelectorAll('.createBtn')

let editId = null
let editType = null
let creating = false

let deleteId = null
let deleteType = null

const editModal = document.getElementById('editModal')
const deleteModal = document.getElementById('deleteModal')
const editForm = document.getElementById('editForm')
const saveEdit = document.getElementById('saveEdit')
const confirmDelete = document.getElementById('confirmDelete')
const closeButtons = document.querySelectorAll('.closeModal')

function authHeaders() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

function createLabeledInput(name, value = '') {
    const label = document.createElement('label')
    label.textContent = name
    label.htmlFor = name
    const input = document.createElement('input')
    input.name = name
    input.id = name
    input.value = value
    editForm.appendChild(label)
    editForm.appendChild(input)
}

function createLabeledSelect(name, options, value = '') {
    const label = document.createElement('label')
    label.textContent = name
    label.htmlFor = name
    const select = document.createElement('select')
    select.name = name
    select.id = name
    options.forEach(o => {
        const opt = document.createElement('option')
        opt.value = o
        opt.textContent = o
        select.appendChild(opt)
    })
    select.value = value
    editForm.appendChild(label)
    editForm.appendChild(select)
}

function createLabeledFile(name) {
    const label = document.createElement('label')
    label.textContent = name
    label.htmlFor = name
    const input = document.createElement('input')
    input.type = 'file'
    input.name = name
    input.id = name
    input.accept = 'image/png'
    editForm.appendChild(label)
    editForm.appendChild(input)
}

function openEdit(type, item) {
    creating = false
    editType = type
    editId = item.id
    editForm.innerHTML = ''
    if (type === 'produtos') {
        createLabeledInput('nome', item.nome)
        createLabeledInput('descricao', item.descricao)
        createLabeledInput('valor', item.valor)
        createLabeledInput('estoque', item.estoque)
        createLabeledFile('imagem')
    }
    if (type === 'clientes') {
        createLabeledInput('nome', item.nome)
        createLabeledInput('email', item.email)
        createLabeledInput('telefone', item.telefone)
        createLabeledInput('senha', '')
        createLabeledSelect('role', ['user', 'admin'], item.role)
    }
    if (type === 'pedidos') {
        createLabeledInput('quantidade', item.quantidade)
        createLabeledInput('valorTotal', item.valorTotal)
        createLabeledInput('dataPedido', item.dataPedido)
        createLabeledInput('clienteId', item.clienteId)
        createLabeledInput('produtoId', item.produtoId)
    }
    editModal.classList.add('active')
}

createBtns.forEach(btn => {
    btn.onclick = e => {
        e.preventDefault()
        creating = true
        editType = btn.dataset.create
        editForm.innerHTML = ''
        if (editType === 'produtos') {
            createLabeledInput('nome')
            createLabeledInput('descricao')
            createLabeledInput('valor')
            createLabeledInput('estoque')
            createLabeledFile('imagem')
        }
        if (editType === 'clientes') {
            createLabeledInput('nome')
            createLabeledInput('email')
            createLabeledInput('telefone')
            createLabeledInput('senha')
            createLabeledSelect('role', ['user', 'admin'])
        }
        if (editType === 'pedidos') {
            createLabeledInput('quantidade')
            createLabeledInput('valorTotal')
            createLabeledInput('dataPedido')
            createLabeledInput('clienteId')
            createLabeledInput('produtoId')
        }
        editModal.classList.add('active')
    }
})

function openDelete(type, id) {
    deleteType = type
    deleteId = id
    deleteModal.classList.add('active')
}

closeButtons.forEach(btn => {
    btn.onclick = e => {
        e.preventDefault()
        editModal.classList.remove('active')
        deleteModal.classList.remove('active')
    }
})

saveEdit.onclick = async e => {
    e.preventDefault()

    const url = creating
        ? `http://localhost:3000/${editType}`
        : `http://localhost:3000/${editType}/${editId}`

    const method = creating ? 'POST' : 'PUT'

    const hasFile = editType === 'produtos'
    let body
    let headers = { ...authHeaders() }

    if (hasFile) {
        body = new FormData(editForm)
    } else {
        body = JSON.stringify(Object.fromEntries(new FormData(editForm)))
        headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(url, { method, headers, body })

    if (!res.ok) return

    editModal.classList.remove('active')

    if (editType === 'produtos') loadProducts()
    if (editType === 'clientes') loadClients()
    if (editType === 'pedidos') loadOrders()

    showAlert(creating ? 'Criado com sucesso' : 'Atualizado com sucesso')
}

function showAlert(msg) {
    let alert = document.createElement('div')
    alert.className = 'alertPopup'
    alert.textContent = msg
    document.body.appendChild(alert)
    setTimeout(() => alert.classList.add('active'), 10)
    setTimeout(() => {
        alert.classList.remove('active')
        setTimeout(() => alert.remove(), 300)
    }, 2000)
}



confirmDelete.onclick = async e => {
    e.preventDefault()
    await fetch(`http://localhost:3000/${deleteType}/${deleteId}`, {
        method: 'DELETE',
        headers: authHeaders()
    })

    deleteModal.classList.remove('active')

    if (deleteType === 'produtos') loadProducts()
    if (deleteType === 'clientes') loadClients()
    if (deleteType === 'pedidos') loadOrders()

    showAlert('Deletado com sucesso')
}

async function loadProducts() {
    const res = await fetch('http://localhost:3000/produtos')
    const data = await res.json()
    productsGrid.innerHTML = ''
    data.forEach(p => {
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
      <h4>${p.nome}</h4>
      <p>ID: ${p.id}</p>
      <p>Valor: R$ ${p.valor}</p>
      <p>Estoque: ${p.estoque}</p>
      <div class="cardBtns">
        <button class="editBtn">Editar</button>
        <button class="deleteBtn">Excluir</button>
      </div>
    `
        card.querySelector('.editBtn').onclick = () => openEdit('produtos', p)
        card.querySelector('.deleteBtn').onclick = () => openDelete('produtos', p.id)
        productsGrid.appendChild(card)
    })
}

async function loadClients() {
    const res = await fetch('http://localhost:3000/clientes', { headers: authHeaders() })
    const data = await res.json()
    clientsList.innerHTML = ''
    data.forEach(c => {
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
      <h4>${c.nome}</h4>
      <p>ID: ${c.id}</p>
      <p>Email: ${c.email}</p>
      <p>Telefone: ${c.telefone}</p>
      <p>Role: ${c.role}</p>
      <div class="cardBtns">
        <button class="editBtn">Editar</button>
        <button class="deleteBtn">Excluir</button>
      </div>
    `
        card.querySelector('.editBtn').onclick = () => openEdit('clientes', c)
        card.querySelector('.deleteBtn').onclick = () => openDelete('clientes', c.id)
        clientsList.appendChild(card)
    })
}

async function loadOrders() {
    const res = await fetch('http://localhost:3000/pedidos', { headers: authHeaders() })
    if (!res.ok) return
    const data = await res.json()
    ordersList.innerHTML = ''
    data.forEach(o => {
        const card = document.createElement('div')
        card.className = 'card'
        card.innerHTML = `
      <h4>Pedido #${o.id}</h4>
      <p>Quantidade: ${o.quantidade}</p>
      <p>Valor Total: R$ ${o.valorTotal}</p>
      <p>Data: ${o.dataPedido}</p>
      <p>Cliente: ${o.clienteId}</p>
      <p>Produto: ${o.produtoId}</p>
      <div class="cardBtns">
        <button class="editBtn">Editar</button>
        <button class="deleteBtn">Excluir</button>
      </div>
    `
        card.querySelector('.editBtn').onclick = () => openEdit('pedidos', o)
        card.querySelector('.deleteBtn').onclick = () => openDelete('pedidos', o.id)
        ordersList.appendChild(card)
    })
}

loadProducts()
loadClients()
loadOrders()
