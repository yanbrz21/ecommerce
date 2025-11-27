// index.js

// array que receberá produtos da API
let products1 = [];

async function loadProducts(){
  try{
    const res = await fetch('http://localhost:3000/produtos');
    const data = await res.json();

    products1 = data.map(p => ({
      id: p.id,
      title: p.nome,
      price: p.valor,
      desc: p.descricao || "",
      img: p.imagem,
      category: p.categoria || "geral",
      tag: "Novo"
    }));

    applyFilters();
  }catch(err){
    console.error("Erro ao carregar produtos:", err);
  }
}

function applyFilters(){
  const container = document.getElementById('produtos');
  container.innerHTML = "";

  products1.forEach(p => {
    container.innerHTML += `
      <div class="produto-card">
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <span>R$ ${p.price}</span>
        <button>Comprar</button>
      </div>
    `;
  });
}

loadProducts();
