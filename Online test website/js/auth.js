// Authentication Logic

document.addEventListener('DOMContentLoaded', () => {

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulation: Simple check
            // In a real app, this would be an API call

            // Check for Admin (Hardcoded for simulation)
            if (email === 'admin@edutest.com' && password === 'admin123') {
                const adminUser = {
                    name: 'Administrator',
                    email: email,
                    role: 'admin'
                };
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                alert('Login Successful! Redirecting to Admin Panel...');
                window.location.href = 'admin.html'; // We will create this later
                return;
            }

            // Check against stored users (Simulated DB)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Welcome back, ${user.name}!`);
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password. Please try again or Sign Up.');
            }
        });
    }

    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            // Basic Validation
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user exists
            if (users.some(u => u.email === email)) {
                alert('Email already registered. Please Login.');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password, // In real app, never store plain text
                role: 'student',
                joined: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto Login
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            alert('Account created successfully!');
            window.location.href = 'dashboard.html';
        });
    }

    // Forgot Password Handler
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Password reset link sent to your email (Simulated).');
            const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            modal.hide();
        });
    }

});
