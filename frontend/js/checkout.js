const checkoutItems = document.getElementById('checkoutItems')
const checkoutTotal = document.getElementById('checkoutTotal')
const addressInfo = document.getElementById('addressInfo')
const finishPurchase = document.getElementById('finishPurchase')

let cartItemsCache = []
let totalCache = 0

function formatBRL(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function loadCheckout() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token || !user) {
    window.location.href = '../index.html'
    return
  }

  const cartRes = await fetch('http://localhost:3000/cart', {
    headers: { Authorization: `Bearer ${token}` }
  })

  const items = await cartRes.json()
  cartItemsCache = items

  let total = 0
  checkoutItems.innerHTML = ''

  if (!items.length) {
    checkoutItems.innerHTML = '<span style="color:#fff;">Seu carrinho está vazio</span>'
  }

  items.forEach(item => {
    const subtotal = item.Produto.valor * item.quantidade
    total += subtotal

    let imageSrc = '../assets/no-image.png'

    if (item.Produto.imagem?.data) {
      const bytes = new Uint8Array(item.Produto.imagem.data)
      let binary = ''
      bytes.forEach(b => binary += String.fromCharCode(b))
      imageSrc = `data:image/png;base64,${btoa(binary)}`
    }

    const div = document.createElement('div')
    div.className = 'checkoutItem'
    div.innerHTML = `
      <img src="${imageSrc}">
      <div class="checkoutItemInfo">
        <span class="checkoutItemName">${item.Produto.nome}</span>
        <span class="checkoutItemPrice">${formatBRL(item.Produto.valor)}</span>
      </div>
      <div class="checkoutQuantityControl">
        <span style="color:#fff;">${item.quantidade}x</span>
      </div>
    `
    checkoutItems.appendChild(div)
  })

  totalCache = total
  checkoutTotal.textContent = formatBRL(total)

  const addrRes = await fetch(`http://localhost:3000/enderecos/cliente/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const addrList = await addrRes.json()

  if (!addrList.length) {
    addressInfo.innerHTML = '<span style="color:#fff;">Nenhum endereço cadastrado</span>'
    return
  }

  const addr = addrList[0]

  addressInfo.innerHTML = `
    <span style="color:#fff;">
      ${addr.logradouro}, ${addr.bairro}<br>
      ${addr.localidade} - ${addr.uf}<br>
      CEP: ${addr.cep}
    </span>
  `
}

finishPurchase.addEventListener('click', async () => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const metodoPagamento = document.getElementById('paymentMethod').value

  // Verifica estoque antes de enviar pedido
  const outOfStock = cartItemsCache.filter(item => item.quantidade > item.Produto.estoque)
  if (outOfStock.length) {
    const nomes = outOfStock.map(i => i.Produto.nome).join(', ')
    alert(`Não há estoque suficiente para: ${nomes}`)
    return
  }

  const payload = {
    idCliente: user.id,
    valorTotal: totalCache,
    metodoPagamento,
    itens: cartItemsCache.map(item => ({
      idProduto: item.Produto.id,
      quantidade: item.quantidade,
      valorUnit: item.Produto.valor
    }))
  }

  const res = await fetch('http://localhost:3000/pedidos/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const data = await res.json()
    alert(data.message || 'Erro ao finalizar pedido')
    return
  }

  alert('Pedido finalizado com sucesso')
  window.location.href = '../html/index.html'
})

loadCheckout()
