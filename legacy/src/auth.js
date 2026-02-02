// Authentication logic using localStorage
const AUTH_KEY = 'tax_dashboard_auth';

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

// Login function
function login(email, password) {
    // Simple demo authentication - accepts any email/password
    if (email && password) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem('user_email', email);
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('user_email');
    window.location.href = 'login.html';
}

// Get current user email
function getCurrentUser() {
    return localStorage.getItem('user_email') || 'User';
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (login(email, password)) {
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    });
}

// Protect dashboard page
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (!window.location.pathname.includes('login.html') && !isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
