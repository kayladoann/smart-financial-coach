// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!token && currentPage !== 'login.html') {
    window.location.href = 'login.html';
  } else if (token && currentPage === 'login.html') {
    window.location.href = 'index.html';
  }
}

// Logout function
function logout() {
  api.clearToken();
  window.location.href = 'login.html';
}

// Login form handler
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('error-message');

    try {
      errorDiv.textContent = '';
      const response = await api.login(email, password);
      
      api.setToken(response.token);
      window.location.href = 'index.html';
    } catch (error) {
      errorDiv.textContent = error.message;
    }
  });
}

// Register form handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        firstName: document.getElementById('register-firstname').value,
        lastName: document.getElementById('register-lastname').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    };
    const errorDiv = document.getElementById('error-message');

    try {
        errorDiv.textContent = '';
        const response = await api.register(userData);
        
        api.setToken(response.token);
        window.location.href = 'index.html';
    } catch (error) {
            errorDiv.textContent = error.message;
        }
    });
}

// Tab switching
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }

// Check auth on page load
checkAuth();