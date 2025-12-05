const ordersContainer = document.getElementById('ordersContainer')
const totalOrders = document.getElementById('totalOrders')
const totalSpent = document.getElementById('totalSpent')

// Pega os dados do usuário do localStorage
const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
if (!user || !token) {
  alert('Usuário não logado')
  window.location.href = '../html/index.html'
}

const userId = user.id

async function fetchUserOrders() {
  try {
    const res = await fetch(`http://localhost:3000/pedidos/usuario/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) throw new Error('Erro ao buscar pedidos')

    const pedidos = await res.json()
    renderOrders(pedidos)
  } catch (err) {
    console.error(err)
    ordersContainer.innerHTML = '<p style="color: #fff;">Não foi possível carregar os pedidos.</p>'
  }
}

function renderOrders(pedidos) {
  ordersContainer.innerHTML = ''
  let total = 0

  pedidos.forEach(pedido => {
    total += Number(pedido.valorTotal)

    const orderDiv = document.createElement('div')
    orderDiv.classList.add('checkoutItem')

    const itensHTML = pedido.itens.map(item => `
      <div class="checkoutItemInfo" style="color: #fff; display: flex; align-items: center; gap: 12px;">
        ${item.imagem ? `<img src="data:image/png;base64,${item.imagem}" alt="${item.nome}" style="width:60px;height:60px;border-radius:8px;">` : ''}
        <div>
          <span class="checkoutItemName">${item.nome}</span>
          <span class="checkoutItemPrice">Qtd: ${item.quantidade} | R$ ${Number(item.valorUnit).toFixed(2)}</span>
        </div>
      </div>
    `).join('')

    orderDiv.innerHTML = `
      <div class="checkoutItemInfo" style="justify-content: space-between; color: #fff;">
        <strong>Pedido #${pedido.id}</strong>
        <div style="text-align: right;">
          <span>Pagamento: ${pedido.metodoPagamento}</span><br>
          <span>Valor total: R$ ${Number(pedido.valorTotal).toFixed(2)}</span>
        </div>
      </div>
      ${itensHTML}
    `

    ordersContainer.appendChild(orderDiv)
  })

  totalOrders.textContent = pedidos.length
  totalSpent.textContent = `R$ ${total.toFixed(2)}`
}

fetchUserOrders()
