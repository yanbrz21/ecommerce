const user = JSON.parse(localStorage.getItem('user'));

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach(b => binary += String.fromCharCode(b));
  return window.btoa(binary);
}

async function loadProduct(productId) {
  try {
    const res = await fetch(`http://localhost:3000/produtos/id/${productId}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    const product = await res.json();

    document.getElementById('mainImg').src = `data:image/png;base64,${arrayBufferToBase64(product.imagem.data)}`;
    document.getElementById('productTitle').textContent = product.nome;
    document.getElementById('productDesc').textContent = product.descricao;
    document.getElementById('productPrice').textContent = Number(product.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // thumbnails
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    if (product.imagens && product.imagens.length > 0) {
      product.imagens.forEach(imgData => {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${arrayBufferToBase64(imgData.data)}`;
        img.onclick = () => document.getElementById('mainImg').src = img.src;
        thumbnailsContainer.appendChild(img);
      });
    }
  } catch (err) {
    alert(err.message);
  }
}

async function loadUserAddress() {
  const addressInfo = document.getElementById('addressInfo');
  if (!user) {
    addressInfo.textContent = 'Faça login para ver seu endereço.';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/enderecos/cliente/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Endereço não encontrado');

    const addrList = await res.json();
    if (!addrList || addrList.length === 0) {
      addressInfo.textContent = 'Endereço não cadastrado.';
      return;
    }

    const addr = addrList[0]; // pegar o primeiro endereço
    addressInfo.innerHTML = `
      CEP: ${addr.cep}<br>
      Logradouro: ${addr.logradouro || '-'}<br>
      Bairro: ${addr.bairro || '-'}<br>
      Cidade: ${addr.localidade || '-'}<br>
      UF: ${addr.uf || '-'}
    `;
  } catch {
    addressInfo.textContent = 'Endereço não encontrado.';
  }
}

document.getElementById('addToCartBtn').addEventListener('click', () => {
  const qty = parseInt(document.getElementById('quantity').value);
  const productId = getProductIdFromURL();
  if (!productId) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  cart[productId] = (cart[productId] || 0) + qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Adicionado ${qty} unidade(s) ao carrinho`);
});

const productId = getProductIdFromURL();
if (productId) loadProduct(productId);
loadUserAddress();
