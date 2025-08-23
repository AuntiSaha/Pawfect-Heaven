// Authentication JavaScript for PetCare BD

// Global variables
let currentUser = null;
let selectedRole = null;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Setup form event listeners
    setupAuthForms();
    
    // Initialize role selection for registration
    if (document.getElementById('registerForm')) {
        initializeRoleSelection();
    }
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('petcare_token') || sessionStorage.getItem('petcare_token');
    const user = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
    
    if (token && user) {
        currentUser = JSON.parse(user);

        redirectToDashboard();
    }
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {

        loginForm.addEventListener('submit', handleLogin);
        
        // Test: Add a change listener to the userType field
        const userTypeField = document.getElementById('userType');
        if (userTypeField) {
            userTypeField.addEventListener('change', function() {
                // UserType selection changed
            });
        }
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
}

// Initialize role selection
function initializeRoleSelection() {
    const roleOptions = document.querySelectorAll('.role-option');
    
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const role = this.querySelector('input').value;
            selectRole(role);
        });
    });
}

// Select user role
function selectRole(role) {
    selectedRole = role;
    
    // Update visual selection
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (role === 'user') {
        document.getElementById('userRoleCard').classList.add('selected');
        document.getElementById('userType').checked = true;
        document.getElementById('providerFields').classList.add('d-none');
    } else if (role === 'provider') {
        document.getElementById('providerRoleCard').classList.add('selected');
        document.getElementById('providerType').checked = true;
        document.getElementById('providerFields').classList.remove('d-none');
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    

    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    

    
    // Validate form
    if (!validateLoginForm(email, password, userType)) {
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Debug: Log the values being used

        // Admin authentication check
        if (userType === 'admin') {
            // Simple admin credentials for demo
            if (email === 'admin@pawfect.com' && password === 'admin123') {
                const user = {
                    id: Date.now(),
                    email: email,
                    name: 'Administrator',
                    type: userType,
                    location: 'Dhaka, Bangladesh'
                };
                
                // Store user data
                if (rememberMe) {
                    localStorage.setItem('petcare_token', 'mock_token_' + Date.now());
                    localStorage.setItem('petcare_user', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('petcare_token', 'mock_token_' + Date.now());
                    sessionStorage.setItem('petcare_user', JSON.stringify(user));
                }
                
                currentUser = user;
                
                // Show success message
                showNotification('Admin login successful! Redirecting...', 'success');
                
                // Redirect to admin dashboard
                setTimeout(() => {
                    redirectToDashboard();
                }, 1000);
                
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            } else {
                showNotification('Invalid admin credentials. Use admin@pawfect.com / admin123', 'danger');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Mock authentication for regular users
        const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            type: userType,
            location: 'Dhaka, Bangladesh'
        };
        

        

        
        // Store user data
        if (rememberMe) {
            localStorage.setItem('petcare_token', 'mock_token_' + Date.now());
            localStorage.setItem('petcare_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('petcare_token', 'mock_token_' + Date.now());
            sessionStorage.setItem('petcare_user', JSON.stringify(user));
        }
        
        currentUser = user;
        
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            redirectToDashboard();
        }, 1000);
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Handle registration form submission
function handleRegistration(event) {
    event.preventDefault();
    
    if (!selectedRole) {
        showNotification('Please select your role', 'warning');
        return;
    }
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        userType: selectedRole,
        termsAgreement: document.getElementById('termsAgreement').checked
    };
    
    // Validate form
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Mock user creation
        const user = {
            id: Date.now(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            type: formData.userType,
            createdAt: new Date().toISOString()
        };
        
        // Store user data
        localStorage.setItem('petcare_token', 'mock_token_' + Date.now());
        localStorage.setItem('petcare_user', JSON.stringify(user));
        
        currentUser = user;
        
        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to appropriate dashboard
        setTimeout(() => {
            redirectToDashboard();
        }, 1000);
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Validate login form
function validateLoginForm(email, password, userType) {

    
    if (!email) {
        showNotification('Please enter your email address', 'warning');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'warning');
        return false;
    }
    
    if (!password) {
        showNotification('Please enter your password', 'warning');
        return false;
    }
    
    if (!userType) {

        showNotification('Please select your role', 'warning');
        return false;
    }
    

    return true;
}

// Validate registration form
function validateRegistrationForm(formData) {
    if (!formData.firstName) {
        showNotification('Please enter your first name', 'warning');
        return false;
    }
    
    if (!formData.lastName) {
        showNotification('Please enter your last name', 'warning');
        return false;
    }
    
    if (!formData.email) {
        showNotification('Please enter your email address', 'warning');
        return false;
    }
    
    if (!isValidEmail(formData.email)) {
        showNotification('Please enter a valid email address', 'warning');
        return false;
    }
    
    if (!formData.phone) {
        showNotification('Please enter your phone number', 'warning');
        return false;
    }
    
    if (!formData.location) {
        showNotification('Please enter your location', 'warning');
        return false;
    }
    
    if (!formData.password) {
        showNotification('Please enter a password', 'warning');
        return false;
    }
    
    if (formData.password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'warning');
        return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showNotification('Passwords do not match', 'warning');
        return false;
    }
    
    if (!formData.termsAgreement) {
        showNotification('Please agree to the terms and conditions', 'warning');
        return false;
    }
    
    return true;
}

// Redirect to appropriate dashboard
function redirectToDashboard() {
    console.log('Redirect function called with currentUser:', currentUser);
    console.log('User type:', currentUser?.type);
    
    if (currentUser && currentUser.type === 'admin') {
        console.log('Redirecting to admin dashboard');
        window.location.href = 'admin-dashboard.html';
    } else if (currentUser && currentUser.type === 'provider') {
        console.log('Redirecting to provider dashboard');
        window.location.href = 'provider-dashboard.html';
    } else {
        console.log('Redirecting to user dashboard');
        window.location.href = 'user-dashboard.html';
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Logout function
function logout() {
    // Clear stored data
    localStorage.removeItem('petcare_token');
    localStorage.removeItem('petcare_user');
    sessionStorage.removeItem('petcare_token');
    sessionStorage.removeItem('petcare_user');
    
    currentUser = null;
    
    // Show logout message
    showNotification('Logged out successfully', 'success');
    
    // Redirect to landing page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Export functions for global access
window.selectRole = selectRole;
window.togglePassword = togglePassword;
window.logout = logout;
