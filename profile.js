// Profile Page JavaScript
let currentUser = null;
let userPets = [];
let userPreferences = {};

// Initialize the profile page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadUserPets();
    loadUserPreferences();
    setupFormHandlers();
    setupLocationServices();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('petcare_token') || sessionStorage.getItem('petcare_token');
    const user = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
        updateProfileDisplay();
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = 'login.html';
    }
}

// Load user data and populate forms
function loadUserData() {
    if (!currentUser) return;
    
    // Populate personal information form
    document.getElementById('firstName').value = currentUser.firstName || currentUser.name?.split(' ')[0] || '';
    document.getElementById('lastName').value = currentUser.lastName || currentUser.name?.split(' ')[1] || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('dateOfBirth').value = currentUser.dateOfBirth || '';
    document.getElementById('gender').value = currentUser.gender || '';
    document.getElementById('address').value = currentUser.address || '';
    document.getElementById('city').value = currentUser.city || 'Dhaka';
    document.getElementById('postalCode').value = currentUser.postalCode || '';
    
    // Update profile display
    updateProfileDisplay();
}

// Update profile display elements
function updateProfileDisplay() {
    if (!currentUser) return;
    
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) {
        profileName.textContent = `${currentUser.firstName || currentUser.name?.split(' ')[0] || 'User'} ${currentUser.lastName || currentUser.name?.split(' ')[1] || ''}`.trim();
    }
    
    if (profileEmail) {
        profileEmail.textContent = currentUser.email || 'user@example.com';
    }
}

// Load user pets
function loadUserPets() {
    // Mock data - in real app, this would come from API
    userPets = [
        {
            id: 1,
            name: 'Buddy',
            type: 'dog',
            breed: 'Golden Retriever',
            age: 3,
            weight: 25.5,
            notes: 'Loves playing fetch, allergic to chicken'
        },
        {
            id: 2,
            name: 'Whiskers',
            type: 'cat',
            breed: 'Persian',
            age: 2,
            weight: 4.2,
            notes: 'Indoor cat, needs regular grooming'
        }
    ];
    
    displayUserPets();
    updatePetStats();
}

// Display user pets
function displayUserPets() {
    const container = document.getElementById('petsContainer');
    if (!container) return;
    
    if (userPets.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-paw fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No pets added yet</h5>
                <p class="text-muted">Add your first pet to get started</p>
                <button class="btn btn-primary" onclick="addNewPet()">
                    <i class="fas fa-plus me-2"></i>Add Your First Pet
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userPets.map(pet => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center">
                        <i class="fas fa-${getPetIcon(pet.type)} fa-2x text-primary"></i>
                    </div>
                    <div class="col-md-7">
                        <h6 class="card-title mb-1">${pet.name}</h6>
                        <p class="text-muted mb-1">${pet.breed} • ${pet.age} years old • ${pet.weight} kg</p>
                        ${pet.notes ? `<small class="text-muted">${pet.notes}</small>` : ''}
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="editPet(${pet.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deletePet(${pet.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get pet icon based on type
function getPetIcon(type) {
    const icons = {
        'dog': 'dog',
        'cat': 'cat',
        'bird': 'dove',
        'fish': 'fish',
        'other': 'paw'
    };
    return icons[type] || 'paw';
}

// Update pet statistics
function updatePetStats() {
    const totalBookings = document.getElementById('totalBookings');
    const completedBookings = document.getElementById('completedBookings');
    const pendingBookings = document.getElementById('pendingBookings');
    const totalSpent = document.getElementById('totalSpent');
    
    if (totalBookings) totalBookings.textContent = '12';
    if (completedBookings) completedBookings.textContent = '8';
    if (pendingBookings) pendingBookings.textContent = '2';
    if (totalSpent) totalSpent.textContent = '৳8,500';
}

// Load user preferences
function loadUserPreferences() {
    // Mock data - in real app, this would come from API
    userPreferences = {
        serviceTypes: ['dog-walking', 'pet-sitting'],
        maxDistance: 5,
        contactMethod: 'phone',
        emailNotifications: ['booking-confirmation', 'reminders'],
        smsNotifications: ['urgent-updates'],
        pushNotifications: ['new-services', 'nearby-providers']
    };
    
    populatePreferencesForm();
}

// Populate preferences form
function populatePreferencesForm() {
    // Service types
    if (userPreferences.serviceTypes.includes('dog-walking')) {
        document.getElementById('prefDogWalking').checked = true;
    }
    if (userPreferences.serviceTypes.includes('pet-sitting')) {
        document.getElementById('prefPetSitting').checked = true;
    }
    if (userPreferences.serviceTypes.includes('grooming')) {
        document.getElementById('prefGrooming').checked = true;
    }
    if (userPreferences.serviceTypes.includes('veterinary')) {
        document.getElementById('prefVeterinary').checked = true;
    }
    
    // Max distance
    document.getElementById('maxDistance').value = userPreferences.maxDistance;
    
    // Contact method
    document.querySelector(`input[name="contactMethod"][value="${userPreferences.contactMethod}"]`).checked = true;
    
    // Email notifications
    userPreferences.emailNotifications.forEach(type => {
        const element = document.getElementById(`email${type.charAt(0).toUpperCase() + type.slice(1).replace('-', '')}`);
        if (element) element.checked = true;
    });
    
    // SMS notifications
    userPreferences.smsNotifications.forEach(type => {
        const element = document.getElementById(`sms${type.charAt(0).toUpperCase() + type.slice(1).replace('-', '')}`);
        if (element) element.checked = true;
    });
    
    // Push notifications
    userPreferences.pushNotifications.forEach(type => {
        const element = document.getElementById(`push${type.charAt(0).toUpperCase() + type.slice(1).replace('-', '')}`);
        if (element) element.checked = true;
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Personal information form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', handlePersonalInfoUpdate);
    }
    
    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesUpdate);
    }
    
    // Security form
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Notifications form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', handleNotificationsUpdate);
    }
}

// Handle personal information update
function handlePersonalInfoUpdate(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim()
    };
    
    if (!validatePersonalInfo(formData)) {
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update current user
        currentUser = { ...currentUser, ...formData };
        
        // Save to storage
        if (localStorage.getItem('petcare_token')) {
            localStorage.setItem('petcare_user', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('petcare_user', JSON.stringify(currentUser));
        }
        
        // Update display
        updateProfileDisplay();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification('Personal information updated successfully!', 'success');
    }, 1000);
}

// Validate personal information
function validatePersonalInfo(data) {
    if (!data.firstName || !data.lastName) {
        showNotification('First name and last name are required', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    if (!data.address || !data.city) {
        showNotification('Address and city are required', 'error');
        return false;
    }
    
    return true;
}

// Handle preferences update
function handlePreferencesUpdate(event) {
    event.preventDefault();
    
    const formData = {
        serviceTypes: [],
        maxDistance: parseInt(document.getElementById('maxDistance').value),
        contactMethod: document.querySelector('input[name="contactMethod"]:checked').value
    };
    
    // Get selected service types
    if (document.getElementById('prefDogWalking').checked) formData.serviceTypes.push('dog-walking');
    if (document.getElementById('prefPetSitting').checked) formData.serviceTypes.push('pet-sitting');
    if (document.getElementById('prefGrooming').checked) formData.serviceTypes.push('grooming');
    if (document.getElementById('prefVeterinary').checked) formData.serviceTypes.push('veterinary');
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        userPreferences = { ...userPreferences, ...formData };
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('Preferences updated successfully!', 'success');
    }, 1000);
}

// Handle password change
function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Updating...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // In real app, this would update the password via API
        event.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('Password updated successfully!', 'success');
    }, 1000);
}

// Validate password change
function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword) {
        showNotification('Current password is required', 'error');
        return false;
    }
    
    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters long', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return false;
    }
    
    return true;
}

// Handle notifications update
function handleNotificationsUpdate(event) {
    event.preventDefault();
    
    const formData = {
        emailNotifications: [],
        smsNotifications: [],
        pushNotifications: []
    };
    
    // Get email notifications
    if (document.getElementById('emailBooking').checked) formData.emailNotifications.push('booking-confirmation');
    if (document.getElementById('emailReminders').checked) formData.emailNotifications.push('reminders');
    if (document.getElementById('emailPromotions').checked) formData.emailNotifications.push('promotions');
    
    // Get SMS notifications
    if (document.getElementById('smsUrgent').checked) formData.smsNotifications.push('urgent-updates');
    if (document.getElementById('smsReminders').checked) formData.smsNotifications.push('reminders');
    
    // Get push notifications
    if (document.getElementById('pushNewServices').checked) formData.pushNotifications.push('new-services');
    if (document.getElementById('pushNearby').checked) formData.pushNotifications.push('nearby-providers');
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        userPreferences = { ...userPreferences, ...formData };
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('Notification preferences updated successfully!', 'success');
    }, 1000);
}

// Show different profile sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update navigation active state
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Add new pet
function addNewPet() {
    const modal = new bootstrap.Modal(document.getElementById('addPetModal'));
    modal.show();
}

// Save pet
function savePet() {
    const petData = {
        name: document.getElementById('petName').value.trim(),
        type: document.getElementById('petType').value,
        breed: document.getElementById('petBreed').value.trim(),
        age: parseInt(document.getElementById('petAge').value) || 0,
        weight: parseFloat(document.getElementById('petWeight').value) || 0,
        notes: document.getElementById('petNotes').value.trim()
    };
    
    if (!petData.name || !petData.type) {
        showNotification('Pet name and type are required', 'error');
        return;
    }
    
    const newPet = {
        id: Date.now(),
        ...petData
    };
    
    userPets.push(newPet);
    displayUserPets();
    updatePetStats();
    
    // Reset form and close modal
    document.getElementById('addPetForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPetModal'));
    modal.hide();
    
    showNotification('Pet added successfully!', 'success');
}

// Edit pet
function editPet(petId) {
    const pet = userPets.find(p => p.id === petId);
    if (!pet) return;
    
    // For now, just show a notification
    // In a real app, you'd populate a form with pet data
    showNotification(`Editing ${pet.name}...`, 'info');
}

// Delete pet
function deletePet(petId) {
    if (!confirm('Are you sure you want to delete this pet?')) {
        return;
    }
    
    userPets = userPets.filter(p => p.id !== petId);
    displayUserPets();
    updatePetStats();
    
    showNotification('Pet deleted successfully!', 'success');
}

// Change profile picture
function changeProfilePicture() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // In real app, this would upload to server
            const reader = new FileReader();
            reader.onload = function(e) {
                const profileImg = document.querySelector('.card-body img');
                if (profileImg) {
                    profileImg.src = e.target.result;
                }
                showNotification('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Setup location services
function setupLocationServices() {
    // Get current location if available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const city = getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
                updateLocationDisplay(city);
            },
            function(error) {
                console.log('Location error:', error);
            }
        );
    }
}

// Update location display
function updateLocationDisplay(city) {
    const locationElement = document.getElementById('current-location');
    if (locationElement) {
        locationElement.textContent = city;
    }
}

// Change location manually
function changeLocation() {
    const newLocation = prompt('Enter your city/location:');
    if (newLocation && newLocation.trim()) {
        updateLocationDisplay(newLocation.trim());
        showNotification('Location updated successfully!', 'success');
    }
}

// Get city from coordinates (mock function)
function getCityFromCoordinates(lat, lng) {
    // In real app, this would use a reverse geocoding service
    if (lat > 23.5 && lat < 24.0 && lng > 90.0 && lng < 90.5) {
        return 'Dhaka, Bangladesh';
    } else if (lat > 22.0 && lat < 23.0 && lng > 89.0 && lng < 90.0) {
        return 'Chittagong, Bangladesh';
    } else {
        return 'Dhaka, Bangladesh';
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
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
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('petcare_token');
        localStorage.removeItem('petcare_user');
        sessionStorage.removeItem('petcare_token');
        sessionStorage.removeItem('petcare_user');
        window.location.href = 'index.html';
    }
}

// Export logout function for global access
window.logout = logout;

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}
