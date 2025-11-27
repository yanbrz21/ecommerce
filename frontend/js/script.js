const API_URL = 'http://localhost:3000';

// --- Login ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    const message = document.getElementById('loginMessage');

    if (res.ok) {
      sessionStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      message.textContent = data.message;
      message.className = 'message error';
    }
  });
}

// --- Cadastro ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = document.getElementById('registerNome').value;
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerSenha').value;
    const telefone = document.getElementById('registerTelefone').value;

    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ nome, email, senha, telefone })
    });

    const data = await res.json();
    const message = document.getElementById('registerMessage');

    if (res.ok) {
      message.textContent = 'Cadastro realizado! Redirecionando...';
      message.className = 'message success';
      setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
      message.textContent = data.message;
      message.className = 'message error';
    }
  });
}

// --- Dashboard & Abas ---
const productsGrid = document.getElementById('productsGrid');
const clientsList = document.getElementById('clientsList');
const ordersList = document.getElementById('ordersList');

if (productsGrid || clientsList || ordersList) {
  const token = sessionStorage.getItem('token');
  // Se não houver token, redireciona para o login (garante que só acessa logado)
  if (!token) window.location.href = 'index.html';

  // Gerenciamento de Abas
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function activateTab(tabId) {
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabId) {
        content.classList.add('active');
      }
    });

    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      }
    });

    // Carregar dados da aba ativa
    if (tabId === 'products') loadProducts();
    if (tabId === 'clients') loadClients();
    if (tabId === 'orders') loadOrders();
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });
  });

  // Ativa a primeira aba ao carregar a página
  if (tabButtons.length > 0) {
    activateTab(tabButtons[0].dataset.tab);
  }

  // Funções de Carregamento de Dados
  async function loadProducts() {
    // Usando o endpoint /produtos e o token para autenticação
    const res = await fetch(`${API_URL}/produtos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const produtos = await res.json();
    productsGrid.innerHTML = produtos.map(p => `
      <div class="product-card">
        <h3>${p.nome}</h3>
        <p>Estoque: ${p.estoque || 0}</p>
        <span>R$ ${parseFloat(p.preco).toFixed(2)}</span>
        <button>Comprar</button>
      </div>
    `).join('');
  }

  async function loadClients() {
    // Assumindo um endpoint /clientes
    const res = await fetch(`${API_URL}/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const clientes = await res.json();
    clientsList.innerHTML = clientes.map(c => `
      <div class="client-item">
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Telefone:</strong> ${c.telefone || 'N/A'}</p>
        <button>Editar</button> <button>Deletar</button>
      </div>
    `).join('');
  }

  async function loadOrders() {
    // Assumindo um endpoint /pedidos
    const res = await fetch(`${API_URL}/pedidos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pedidos = await res.json();
    ordersList.innerHTML = pedidos.map(o => `
      <div class="order-item">
        <p><strong>Pedido ID:</strong> ${o.id}</p>
        <p><strong>Cliente ID:</strong> ${o.idCliente}</p>
        <p><strong>Produto ID:</strong> ${o.idProduto}</p>
        <p><strong>Qtd:</strong> ${o.quantidade}</p>
        <p><strong>Total:</strong> R$ ${parseFloat(o.valorTotal).toFixed(2)}</p>
      </div>
    `).join('');
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}