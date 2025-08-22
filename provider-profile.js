// Provider Profile JavaScript
let currentUser = null;
let profileData = {};

// Initialize the provider profile page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadProfileData();
    setupLocationServices();
    setupFormHandlers();
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
        if (currentUser.type !== 'provider') {
            window.location.href = 'user-dashboard.html';
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = 'login.html';
    }
}

// Load user data
function loadUserData() {
    if (currentUser && currentUser.location) {
        document.getElementById('current-location').textContent = currentUser.location;
    }
}

// Load profile data
function loadProfileData() {
    // Mock profile data - in real app, this would come from API
    profileData = {
        personal: {
            firstName: 'Ahmed',
            lastName: 'Rahman',
            email: 'ahmed.rahman@email.com',
            phone: '+880 1712-345678',
            dateOfBirth: '1990-05-15',
            gender: 'male',
            bio: 'Professional pet care provider with over 5 years of experience. Passionate about animals and committed to providing the best care for your beloved pets.'
        },
        business: {
            businessName: 'Ahmed\'s Pet Care Services',
            businessType: 'individual',
            taxId: '1234567890123',
            experience: '5-10',
            businessDescription: 'We provide comprehensive pet care services including dog walking, pet sitting, grooming, and basic veterinary care. Serving the Dhaka area with love and professionalism.'
        },
        services: {
            serviceArea: 8,
            responseTime: '2',
            minimumNotice: '2',
            maxPets: 4,
            specializations: ['dogs', 'cats', 'birds']
        },
        notifications: {
            newBookings: true,
            bookingUpdates: true,
            cancellations: true,
            payments: true,
            refunds: true,
            earnings: false,
            messages: true,
            reviews: true,
            system: true
        },
        notificationMethods: {
            email: true,
            sms: false,
            push: true
        }
    };

    populateProfileForms();
    updateProfileDisplay();
}

// Populate profile forms
function populateProfileForms() {
    // Personal Information
    document.getElementById('firstName').value = profileData.personal.firstName || '';
    document.getElementById('lastName').value = profileData.personal.lastName || '';
    document.getElementById('email').value = profileData.personal.email || '';
    document.getElementById('phone').value = profileData.personal.phone || '';
    document.getElementById('dateOfBirth').value = profileData.personal.dateOfBirth || '';
    document.getElementById('gender').value = profileData.personal.gender || '';
    document.getElementById('bio').value = profileData.personal.bio || '';

    // Business Information
    document.getElementById('businessName').value = profileData.business.businessName || '';
    document.getElementById('businessType').value = profileData.business.businessType || '';
    document.getElementById('taxId').value = profileData.business.taxId || '';
    document.getElementById('experience').value = profileData.business.experience || '';
    document.getElementById('businessDescription').value = profileData.business.businessDescription || '';

    // Service Settings
    document.getElementById('serviceArea').value = profileData.services.serviceArea || 5;
    document.getElementById('responseTime').value = profileData.services.responseTime || '';
    document.getElementById('minimumNotice').value = profileData.services.minimumNotice || '';
    document.getElementById('maxPets').value = profileData.services.maxPets || 3;

    // Specializations
    if (profileData.services.specializations) {
        profileData.services.specializations.forEach(spec => {
            const checkbox = document.getElementById(`spec${spec.charAt(0).toUpperCase() + spec.slice(1)}`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Notifications
    Object.keys(profileData.notifications).forEach(key => {
        const checkbox = document.getElementById(`notif${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (checkbox) checkbox.checked = profileData.notifications[key];
    });

    // Notification Methods
    Object.keys(profileData.notificationMethods).forEach(key => {
        const checkbox = document.getElementById(`method${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (checkbox) checkbox.checked = profileData.notificationMethods[key];
    });
}

// Update profile display
function updateProfileDisplay() {
    const fullName = `${profileData.personal.firstName} ${profileData.personal.lastName}`;
    document.getElementById('profileName').textContent = fullName;
    document.getElementById('profileEmail').textContent = profileData.personal.email;
    document.getElementById('profilePhone').textContent = profileData.personal.phone;
}

// Setup form handlers
function setupFormHandlers() {
    // Add event listeners for form changes
    const forms = ['personalInfoForm', 'businessInfoForm', 'serviceSettingsForm', 'notificationsForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('change', function() {
                // Mark form as modified
                this.dataset.modified = 'true';
            });
        }
    });
}

// Save all changes
function saveAllChanges() {
    // Collect data from all forms
    const updatedData = {
        personal: collectPersonalData(),
        business: collectBusinessData(),
        services: collectServiceData(),
        notifications: collectNotificationData()
    };

    // Validate data
    if (!validateProfileData(updatedData)) {
        return;
    }

    // Update profile data
    profileData = { ...profileData, ...updatedData };

    // Save to localStorage (in real app, this would be an API call)
    try {
        localStorage.setItem('provider_profile', JSON.stringify(profileData));
        
        // Update user data if needed
        if (currentUser) {
            currentUser.firstName = updatedData.personal.firstName;
            currentUser.lastName = updatedData.personal.lastName;
            currentUser.email = updatedData.personal.email;
            currentUser.phone = updatedData.personal.phone;
            localStorage.setItem('petcare_user', JSON.stringify(currentUser));
        }

        // Update display
        updateProfileDisplay();
        
        // Mark forms as unmodified
        const forms = ['personalInfoForm', 'businessInfoForm', 'serviceSettingsForm', 'notificationsForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) form.dataset.modified = 'false';
        });

        showNotification('Profile updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showNotification('Error saving profile. Please try again.', 'error');
    }
}

// Collect personal data
function collectPersonalData() {
    return {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        bio: document.getElementById('bio').value.trim()
    };
}

// Collect business data
function collectBusinessData() {
    return {
        businessName: document.getElementById('businessName').value.trim(),
        businessType: document.getElementById('businessType').value,
        taxId: document.getElementById('taxId').value.trim(),
        experience: document.getElementById('experience').value,
        businessDescription: document.getElementById('businessDescription').value.trim()
    };
}

// Collect service data
function collectServiceData() {
    const specializations = [];
    const specCheckboxes = document.querySelectorAll('input[name="specializations"]:checked');
    specCheckboxes.forEach(checkbox => {
        specializations.push(checkbox.value);
    });

    return {
        serviceArea: parseInt(document.getElementById('serviceArea').value),
        responseTime: document.getElementById('responseTime').value,
        minimumNotice: document.getElementById('minimumNotice').value,
        maxPets: parseInt(document.getElementById('maxPets').value),
        specializations: specializations
    };
}

// Collect notification data
function collectNotificationData() {
    const notifications = {};
    const notificationCheckboxes = document.querySelectorAll('input[name="notifications"]:checked');
    notificationCheckboxes.forEach(checkbox => {
        notifications[checkbox.value] = true;
    });

    const notificationMethods = {};
    const methodCheckboxes = document.querySelectorAll('input[name="notificationMethods"]:checked');
    methodCheckboxes.forEach(checkbox => {
        notificationMethods[checkbox.value] = true;
    });

    return {
        notifications: notifications,
        notificationMethods: notificationMethods
    };
}

// Validate profile data
function validateProfileData(data) {
    // Personal validation
    if (!data.personal.firstName || !data.personal.lastName) {
        showNotification('First name and last name are required.', 'error');
        return false;
    }

    if (!data.personal.email || !isValidEmail(data.personal.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    if (!data.personal.phone || !isValidPhone(data.personal.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }

    // Business validation
    if (!data.business.businessName) {
        showNotification('Business name is required.', 'error');
        return false;
    }

    // Service validation
    if (!data.services.serviceArea || data.services.serviceArea < 1 || data.services.serviceArea > 100) {
        showNotification('Service area must be between 1 and 100 km.', 'error');
        return false;
    }

    if (data.services.specializations.length === 0) {
        showNotification('Please select at least one specialization.', 'error');
        return false;
    }

    return true;
}

// Change profile picture
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // In real app, this would upload to server
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.querySelector('#personal img');
                if (img) {
                    img.src = e.target.result;
                }
                showNotification('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword) {
        showNotification('Please enter your current password.', 'error');
        return;
    }

    if (!newPassword) {
        showNotification('Please enter a new password.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match.', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return;
    }

    // In real app, this would validate current password and update
    showNotification('Password changed successfully!', 'success');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Setup location services
function setupLocationServices() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const city = getCityFromCoordinates(latitude, longitude);
                if (city) {
                    updateLocationDisplay(city);
                }
            },
            error => {
                console.log('Location access denied:', error);
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
    const newLocation = prompt('Enter your city/region:');
    if (newLocation && newLocation.trim()) {
        updateLocationDisplay(newLocation.trim());
        showNotification('Location updated successfully', 'success');
    }
}

// Get city from coordinates (mock function)
function getCityFromCoordinates(lat, lng) {
    // Mock implementation - in real app, this would use reverse geocoding API
    const cities = ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Sylhet, Bangladesh', 'Rajshahi, Bangladesh'];
    return cities[Math.floor(Math.random() * cities.length)];
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Logout function
function logout() {
    localStorage.removeItem('petcare_token');
    localStorage.removeItem('petcare_user');
    sessionStorage.removeItem('petcare_token');
    sessionStorage.removeItem('petcare_user');
    window.location.href = 'index.html';
}

// Export logout function for global access
window.logout = logout;
