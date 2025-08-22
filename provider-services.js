// Provider Services JavaScript
let currentUser = null;
let allServices = [];
let filteredServices = [];
let currentEditingService = null;

// Initialize the provider services page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadServices();
    setupLocationServices();
    updateServiceStats();
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

// Load services
function loadServices() {
    // Mock data - in real app, this would come from API
    allServices = [
        {
            id: 1,
            serviceName: 'Professional Dog Walking',
            category: 'dog-walking',
            price: 500,
            duration: '1hour',
            description: 'Professional dog walking service with GPS tracking and detailed reports. Perfect for busy pet parents who want their dogs to get regular exercise.',
            location: 'Gulshan, Dhaka',
            serviceArea: 5,
            availability: 'immediate',
            status: 'active',
            requirements: 'Dogs must be on leash, owner must provide poop bags',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.8,
            reviews: 127,
            totalBookings: 45,
            createdAt: '2024-01-01'
        },
        {
            id: 2,
            serviceName: 'Pet Sitting & Care',
            category: 'pet-sitting',
            price: 800,
            duration: '8hours',
            description: 'Comprehensive pet sitting service including feeding, playtime, and basic care. Available for dogs, cats, and other pets.',
            location: 'Dhanmondi, Dhaka',
            serviceArea: 3,
            availability: 'week',
            status: 'active',
            requirements: '24-hour notice required, pets must be friendly',
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.9,
            reviews: 89,
            totalBookings: 32,
            createdAt: '2024-01-05'
        },
        {
            id: 3,
            serviceName: 'Pet Grooming Service',
            category: 'grooming',
            price: 1200,
            duration: '3hours',
            description: 'Professional pet grooming including bath, trim, nail clipping, and ear cleaning. Suitable for all dog and cat breeds.',
            location: 'Banani, Dhaka',
            serviceArea: 8,
            availability: 'week',
            status: 'active',
            requirements: 'Pets must be clean and free of parasites',
            image: 'https://images.unsplash.com/photo-1587764379873-9783df4ef613?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.7,
            reviews: 156,
            totalBookings: 78,
            createdAt: '2024-01-10'
        }
    ];
    
    filteredServices = [...allServices];
    displayServices();
}

// Display services
function displayServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;
    
    if (filteredServices.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No services found</h5>
                <p class="text-muted">Try adjusting your filters or add a new service</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addServiceModal">
                    <i class="fas fa-plus me-2"></i>Add Your First Service
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredServices.map(service => `
        <div class="card mb-3 service-card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center">
                        <img src="${service.image}" alt="${service.serviceName}" 
                             class="rounded mb-2" style="width: 80px; height: 80px; object-fit: cover;">
                        <div class="badge bg-${getStatusColor(service.status)}">${getStatusText(service.status)}</div>
                    </div>
                    <div class="col-md-6">
                        <h6 class="card-title mb-1">${service.serviceName}</h6>
                        <p class="text-muted mb-1">
                            <i class="fas fa-tag me-1"></i>${getCategoryText(service.category)} • 
                            <i class="fas fa-clock me-1"></i>${getDurationText(service.duration)}
                        </p>
                        <p class="text-muted mb-1">
                            <i class="fas fa-map-marker-alt me-1"></i>${service.location} • 
                            <i class="fas fa-route me-1"></i>${service.serviceArea} km radius
                        </p>
                        <p class="text-muted mb-0 small">${service.description.substring(0, 100)}${service.description.length > 100 ? '...' : ''}</p>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="fw-bold text-primary mb-1">৳${service.price}</div>
                        <div class="text-warning mb-1">
                            ${'★'.repeat(Math.floor(service.rating))}${'☆'.repeat(5 - Math.floor(service.rating))}
                        </div>
                        <small class="text-muted">${service.rating} (${service.reviews})</small>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-primary btn-sm mb-2" onclick="editService(${service.id})">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'active': 'success',
        'inactive': 'secondary',
        'pending': 'warning'
    };
    return colors[status] || 'secondary';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'active': 'Active',
        'inactive': 'Inactive',
        'pending': 'Pending'
    };
    return texts[status] || status;
}

// Get category text
function getCategoryText(category) {
    const texts = {
        'dog-walking': 'Dog Walking',
        'pet-sitting': 'Pet Sitting',
        'grooming': 'Grooming',
        'veterinary': 'Veterinary Care',
        'training': 'Pet Training',
        'boarding': 'Pet Boarding'
    };
    return texts[category] || category;
}

// Get duration text
function getDurationText(duration) {
    const texts = {
        '30min': '30 minutes',
        '1hour': '1 hour',
        '2hours': '2 hours',
        '4hours': '4 hours',
        '8hours': '8 hours',
        '24hours': '24 hours'
    };
    return texts[duration] || duration;
}

// Filter services
function filterServices() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchQuery = document.getElementById('searchServices').value.toLowerCase();
    
    filteredServices = allServices.filter(service => {
        // Status filter
        if (statusFilter && service.status !== statusFilter) return false;
        
        // Category filter
        if (categoryFilter && service.category !== categoryFilter) return false;
        
        // Search query
        if (searchQuery) {
            const searchText = `${service.serviceName} ${service.description} ${service.location}`.toLowerCase();
            if (!searchText.includes(searchQuery)) return false;
        }
        
        return true;
    });
    
    displayServices();
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('searchServices').value = '';
    
    filteredServices = [...allServices];
    displayServices();
}

// Sort services
function sortServices(criteria) {
    switch (criteria) {
        case 'name':
            filteredServices.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
            break;
        case 'price':
            filteredServices.sort((a, b) => a.price - b.price);
            break;
        case 'rating':
            filteredServices.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    displayServices();
}

// Handle add service
function handleAddService() {
    const form = document.getElementById('addServiceForm');
    const formData = new FormData(form);
    
    const serviceData = {
        serviceName: formData.get('serviceName'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        duration: formData.get('duration'),
        description: formData.get('description'),
        location: formData.get('location'),
        serviceArea: parseInt(formData.get('serviceArea')),
        availability: formData.get('availability'),
        requirements: formData.get('requirements')
    };
    
    if (!validateServiceForm(serviceData)) {
        return;
    }
    
    const submitBtn = document.querySelector('#addServiceModal button[onclick="handleAddService()"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const newService = {
            id: Date.now(),
            ...serviceData,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 0,
            reviews: 0,
            totalBookings: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        allServices.push(newService);
        filteredServices = [...allServices];
        
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        displayServices();
        updateServiceStats();
        
        showNotification('Service added successfully!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
        modal.hide();
    }, 1500);
}

// Validate service form
function validateServiceForm(data) {
    if (!data.serviceName.trim()) {
        showNotification('Service name is required', 'error');
        return false;
    }
    
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    
    if (!data.price || data.price <= 0) {
        showNotification('Please enter a valid price', 'error');
        return false;
    }
    
    if (!data.duration) {
        showNotification('Please select a duration', 'error');
        return false;
    }
    
    if (!data.description.trim()) {
        showNotification('Description is required', 'error');
        return false;
    }
    
    if (!data.location.trim()) {
        showNotification('Location is required', 'error');
        return false;
    }
    
    return true;
}

// Edit service
function editService(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    currentEditingService = service;
    
    // Populate edit form
    document.getElementById('editServiceId').value = service.id;
    document.getElementById('editServiceName').value = service.serviceName;
    document.getElementById('editCategory').value = service.category;
    document.getElementById('editPrice').value = service.price;
    document.getElementById('editDuration').value = service.duration;
    document.getElementById('editDescription').value = service.description;
    document.getElementById('editLocation').value = service.location;
    document.getElementById('editServiceArea').value = service.serviceArea;
    document.getElementById('editAvailability').value = service.availability;
    document.getElementById('editStatus').value = service.status;
    document.getElementById('editRequirements').value = service.requirements || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editServiceModal'));
    modal.show();
}

// Handle edit service
function handleEditService() {
    if (!currentEditingService) return;
    
    const form = document.getElementById('editServiceForm');
    const formData = new FormData(form);
    
    const serviceData = {
        serviceName: formData.get('serviceName'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        duration: formData.get('duration'),
        description: formData.get('description'),
        location: formData.get('location'),
        serviceArea: parseInt(formData.get('serviceArea')),
        availability: formData.get('availability'),
        status: formData.get('status'),
        requirements: formData.get('requirements')
    };
    
    if (!validateServiceForm(serviceData)) {
        return;
    }
    
    const submitBtn = document.querySelector('#editServiceModal button[onclick="handleEditService()"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Updating...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Update service
        const serviceIndex = allServices.findIndex(s => s.id === currentEditingService.id);
        if (serviceIndex !== -1) {
            allServices[serviceIndex] = { ...allServices[serviceIndex], ...serviceData };
        }
        
        filteredServices = [...allServices];
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        displayServices();
        updateServiceStats();
        
        showNotification('Service updated successfully!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
        modal.hide();
        
        currentEditingService = null;
    }, 1500);
}

// Delete service
function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
        return;
    }
    
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    // Check if service has bookings
    if (service.totalBookings > 0) {
        showNotification('Cannot delete service with existing bookings. Please deactivate it instead.', 'warning');
        return;
    }
    
    allServices = allServices.filter(s => s.id !== serviceId);
    filteredServices = [...allServices];
    
    displayServices();
    updateServiceStats();
    
    showNotification('Service deleted successfully!', 'success');
}

// Update service statistics
function updateServiceStats() {
    const totalServices = document.getElementById('totalServices');
    const activeServices = document.getElementById('activeServices');
    const totalBookings = document.getElementById('totalBookings');
    const averageRating = document.getElementById('averageRating');
    
    if (totalServices) totalServices.textContent = allServices.length;
    if (activeServices) activeServices.textContent = allServices.filter(s => s.status === 'active').length;
    
    if (totalBookings) {
        const total = allServices.reduce((sum, s) => sum + s.totalBookings, 0);
        totalBookings.textContent = total;
    }
    
    if (averageRating) {
        const activeServicesWithRating = allServices.filter(s => s.status === 'active' && s.rating > 0);
        if (activeServicesWithRating.length > 0) {
            const avg = activeServicesWithRating.reduce((sum, s) => sum + s.rating, 0) / activeServicesWithRating.length;
            averageRating.textContent = avg.toFixed(1);
        } else {
            averageRating.textContent = '0.0';
        }
    }
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
