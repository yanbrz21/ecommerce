const loginForm = document.getElementById('loginForm')
const loginMessage = document.getElementById('loginMessage')
const registerForm = document.getElementById('registerForm')
const registerMessage = document.getElementById('registerMessage')

const btnLogin = document.getElementById('loginBtn')
const btnRegister = document.getElementById('registerBtn')
const userInfo = document.getElementById('userInfo')


function applyUserUI() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    loginBtn.textContent = 'Logout';
    registerBtn.style.display = 'none';
    userInfo.textContent = `${user.nome} (${user.role})`;

    if (user.role === 'admin') {
      dashBtn.style.display = 'inline-flex';
      dashBtn.onclick = () => window.location.href = 'dashboard.html';
    } else {
      dashBtn.style.display = 'none';
    }
  } else {
    loginBtn.textContent = 'Login';
    registerBtn.style.display = 'inline-flex';
    dashBtn.style.display = 'none';
    userInfo.textContent = '';
  }
}

btnLogin.addEventListener('click', () => {
  const user = localStorage.getItem('user')
  if (user) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    applyUserUI()
  } else {
    document.getElementById('loginModal').style.display = 'flex'
  }
})

btnRegister.addEventListener('click', () => {
  document.getElementById('registerModal').style.display = 'flex'
})

loginForm.addEventListener('submit', async e => {
  e.preventDefault()

  const email = document.getElementById('loginEmail').value.trim()
  const senha = document.getElementById('loginSenha').value.trim()

  if (!email || !senha) {
    loginMessage.textContent = 'Preencha todos os campos'
    loginMessage.className = 'message error'
    return
  }

  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, senha })
  })

  const data = await res.json()

  if (res.ok) {
    loginMessage.textContent = 'Login efetuado'
    loginMessage.className = 'message success'
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setTimeout(() => {
      document.getElementById('loginModal').style.display = 'none'
      applyUserUI()
    }, 700)
  } else {
    loginMessage.textContent = data.message || 'Credenciais inválidas'
    loginMessage.className = 'message error'
  }
})


registerForm.addEventListener('submit', async e => {
  e.preventDefault()

  const nome = document.getElementById('registerNome').value.trim()
  const email = document.getElementById('registerEmail').value.trim()
  const senha = document.getElementById('registerSenha').value.trim()
  const telefone = document.getElementById('registerTelefone').value.trim()
  const cpf = document.getElementById('registerCpf').value.trim()
  const cep = document.getElementById('registerCep').value.trim()

  if (!nome || !email || !senha || !telefone || !cpf || !cep) {
    registerMessage.textContent = 'Preencha todos os campos'
    registerMessage.className = 'message error'
    return
  }

  const res = await fetch('http://localhost:3000/clientes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, email, senha, telefone, cpf, cep })
  })

  const data = await res.json()


  if (res.ok) {
    registerMessage.textContent = 'Cadastro criado'
    registerMessage.className = 'message success'
    setTimeout(() => {
      document.getElementById('registerModal').style.display = 'none'
    }, 700)
  } else {
    registerMessage.textContent = data.message || 'Erro ao cadastrar'
    registerMessage.className = 'message error'
  }
})


applyUserUI()
