// Authentication JavaScript for 21andsaints
class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8000/api';
        this.token = localStorage.getItem('access_token');
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        this.init();
    }

    init() {
        // Initialize forms based on current page
        if (document.getElementById('loginForm')) {
            this.initLoginForm();
        }
        if (document.getElementById('signupForm')) {
            this.initSignupForm();
        }
        
        // Update UI based on auth state
        this.updateAuthUI();
    }

    // Login functionality
    initLoginForm() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Real-time validation
        document.getElementById('username').addEventListener('blur', () => {
            this.validateField('username');
        });
        
        document.getElementById('password').addEventListener('blur', () => {
            this.validateField('password');
        });
    }

    async handleLogin() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate form
        if (!this.validateLoginForm()) {
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        loginBtn.disabled = true;
        
        try {
            const formData = new FormData(form);
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user info
                this.token = data.access_token;
                localStorage.setItem('access_token', this.token);
                
                // Get user info
                await this.fetchCurrentUser();
                
                // Show success message
                this.showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard or home
                setTimeout(() => {
                    window.location.href = '/collection';
                }, 1500);
            } else {
                this.showError('passwordError', data.detail || 'Login failed');
            }
        } catch (error) {
            this.showError('passwordError', 'Network error. Please try again.');
        } finally {
            // Reset button state
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    validateLoginForm() {
        let isValid = true;
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username) {
            this.showError('usernameError', 'Username or email is required');
            isValid = false;
        }
        
        if (!password) {
            this.showError('passwordError', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            this.showError('passwordError', 'Password must be at least 8 characters');
            isValid = false;
        }
        
        return isValid;
    }

    // Signup functionality
    initSignupForm() {
        const form = document.getElementById('signupForm');
        const signupBtn = document.getElementById('signupBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });

        // Real-time validation
        document.getElementById('username').addEventListener('blur', () => {
            this.validateField('username');
        });
        
        document.getElementById('email').addEventListener('blur', () => {
            this.validateField('email');
        });
        
        document.getElementById('password').addEventListener('input', () => {
            this.validatePassword();
        });
        
        document.getElementById('confirmPassword').addEventListener('blur', () => {
            this.validateField('confirmPassword');
        });
    }

    async handleSignup() {
        const form = document.getElementById('signupForm');
        const signupBtn = document.getElementById('signupBtn');
        const btnText = signupBtn.querySelector('.btn-text');
        const btnLoader = signupBtn.querySelector('.btn-loader');
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate form
        if (!this.validateSignupForm()) {
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        signupBtn.disabled = true;
        
        try {
            const formData = {
                username: document.getElementById('username').value.trim(),
                email: document.getElementById('email').value.trim(),
                full_name: document.getElementById('fullName').value.trim(),
                password: document.getElementById('password').value
            };
            
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                this.showNotification('Account created successfully! Redirecting to login...', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                // Show specific error based on response
                if (data.detail.includes('email')) {
                    this.showError('emailError', data.detail);
                } else if (data.detail.includes('username')) {
                    this.showError('usernameError', data.detail);
                } else if (data.detail.includes('password')) {
                    this.showError('passwordError', data.detail);
                } else {
                    this.showError('confirmPasswordError', data.detail);
                }
            }
        } catch (error) {
            this.showError('confirmPasswordError', 'Network error. Please try again.');
        } finally {
            // Reset button state
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            signupBtn.disabled = false;
        }
    }

    validateSignupForm() {
        let isValid = true;
        
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate full name
        if (!fullName) {
            this.showError('fullNameError', 'Full name is required');
            isValid = false;
        }
        
        // Validate username
        if (!username) {
            this.showError('usernameError', 'Username is required');
            isValid = false;
        } else if (username.length < 3) {
            this.showError('usernameError', 'Username must be at least 3 characters');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            this.showError('emailError', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!this.validatePassword()) {
            isValid = false;
        }
        
        // Validate password confirmation
        if (!confirmPassword) {
            this.showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms agreement
        if (!agreeTerms) {
            this.showNotification('Please agree to the Terms & Conditions', 'error');
            isValid = false;
        }
        
        return isValid;
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const strengthIndicator = document.getElementById('passwordStrength');
        
        if (!password) {
            this.showError('passwordError', 'Password is required');
            if (strengthIndicator) strengthIndicator.textContent = '';
            return false;
        }
        
        let strength = 0;
        let feedback = [];
        
        // Check password requirements
        if (password.length >= 8) strength++;
        else feedback.push('8+ characters');
        
        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('uppercase letter');
        
        if (/[a-z]/.test(password)) strength++;
        else feedback.push('lowercase letter');
        
        if (/\d/.test(password)) strength++;
        else feedback.push('number');
        
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push('special character');
        
        // Update strength indicator
        if (strengthIndicator) {
            if (strength <= 2) {
                strengthIndicator.textContent = 'Weak password';
                strengthIndicator.className = 'password-strength weak';
            } else if (strength <= 3) {
                strengthIndicator.textContent = 'Medium password';
                strengthIndicator.className = 'password-strength medium';
            } else {
                strengthIndicator.textContent = 'Strong password';
                strengthIndicator.className = 'password-strength strong';
            }
        }
        
        if (strength < 4) {
            this.showError('passwordError', `Password needs: ${feedback.join(', ')}`);
            return false;
        }
        
        this.clearError('passwordError');
        return true;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        
        if (!value) {
            this.showError(`${fieldName}Error`, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }
        
        if (fieldName === 'email' && !this.isValidEmail(value)) {
            this.showError('emailError', 'Please enter a valid email address');
            return false;
        }
        
        if (fieldName === 'username' && value.length < 3) {
            this.showError('usernameError', 'Username must be at least 3 characters');
            return false;
        }
        
        this.clearError(`${fieldName}Error`);
        return true;
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getFieldLabel(fieldName) {
        const labels = {
            username: 'Username',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm password',
            fullName: 'Full name'
        };
        return labels[fieldName] || fieldName;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    async fetchCurrentUser() {
        if (!this.token) return;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                this.currentUser = await response.json();
                localStorage.setItem('current_user', JSON.stringify(this.currentUser));
                this.updateAuthUI();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    updateAuthUI() {
        // Update navigation based on auth state
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && this.currentUser) {
            // Add user menu, logout button, etc.
            this.addUserMenu();
        }
    }

    addUserMenu() {
        // Implementation for adding user menu to navigation
        // This would show user profile, logout, etc.
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
        window.location.href = '/login';
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other scripts
window.AuthManager = AuthManager;
