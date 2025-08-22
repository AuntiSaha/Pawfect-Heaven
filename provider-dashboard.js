// Provider Dashboard JavaScript for PetCare BD

// Global variables
let currentUser = null;
let notifications = [];
let myServices = [];
let myBookings = [];
let myReviews = [];

// Initialize provider dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeProviderDashboard();
});

function initializeProviderDashboard() {
    // Check authentication
    checkAuth();
    
    // Load user data
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Setup notifications
    setupNotifications();
}

// Check user authentication
function checkAuth() {
    const token = localStorage.getItem('petcare_token') || sessionStorage.getItem('petcare_token');
    const user = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    
    // Check if user is actually a provider
    if (currentUser.type !== 'provider') {
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    // Update UI with user info
    updateUserInfo();
}

// Load user data
function loadUserData() {
    // Update location display
    if (currentUser.location) {
        document.getElementById('current-location').textContent = currentUser.location;
    }
    
    // Update user name in dropdown
    const userNameElements = document.querySelectorAll('.dropdown-toggle');
    userNameElements.forEach(element => {
        element.innerHTML = `<i class="fas fa-user me-2"></i>${currentUser.firstName || currentUser.name}`;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Location change
    const locationBtn = document.querySelector('.location-display button');
    if (locationBtn) {
        locationBtn.addEventListener('click', changeLocation);
    }
    
    // Sidebar toggle for mobile
    setupSidebarToggle();
    
    // Notification interactions
    setupNotificationInteractions();
    
    // Add service form
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', handleAddService);
    }
}

// Setup sidebar toggle for mobile
function setupSidebarToggle() {
    // Add sidebar toggle button for mobile
    if (window.innerWidth <= 991.98) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle d-lg-none';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.onclick = toggleSidebar;
        document.body.appendChild(sidebarToggle);
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// Setup notification interactions
function setupNotificationInteractions() {
    // Mark notifications as read
    document.addEventListener('click', function(e) {
        if (e.target.closest('.dropdown-item')) {
            const notificationText = e.target.textContent;
            markNotificationAsRead(notificationText);
        }
    });
}

// Load dashboard data
function loadDashboardData() {
    // Load my services
    loadMyServices();
    
    // Load my bookings
    loadMyBookings();
    
    // Load my reviews
    loadMyReviews();
    
    // Update statistics
    updateDashboardStats();
}

// Load my services
function loadMyServices() {
    // Mock data for services
    myServices = [
        {
            id: 1,
            serviceName: 'Dog Walking Service',
            description: 'Professional dog walking service in your area. I love dogs and provide safe, fun walks.',
            price: 500,
            category: 'Dog Walking',
            availability: 'Mon-Fri, 6AM-8PM',
            location: 'Gulshan, Dhaka',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 2,
            serviceName: 'Pet Sitting',
            description: 'Reliable pet sitting service when you\'re away. Your pets will be in safe hands.',
            price: 800,
            category: 'Pet Sitting',
            availability: '24/7',
            location: 'Gulshan, Dhaka',
            status: 'active',
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        }
    ];
    
    displayMyServices();
}

// Display my services
function displayMyServices() {
    const container = document.getElementById('myServices');
    if (!container) return;
    
    container.innerHTML = myServices.map(service => `
        <div class="col-lg-6 col-md-12 mb-3">
            <div class="service-overview">
                <div class="d-flex align-items-center mb-2">
                    <img src="${service.image}" alt="${service.serviceName}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div>
                        <h6 class="mb-1">${service.serviceName}</h6>
                        <small class="text-muted">${service.category}</small>
                    </div>
                </div>
                <p class="mb-2">${service.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-primary">৳${service.price}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load my bookings
function loadMyBookings() {
    // Mock data for bookings
    myBookings = [
        {
            id: 1,
            customerName: 'Ahmed Khan',
            serviceName: 'Dog Walking Service',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'confirmed',
            amount: 500,
            petDetails: 'Golden Retriever, 3 years old'
        },
        {
            id: 2,
            customerName: 'Fatima Rahman',
            serviceName: 'Pet Sitting',
            date: '2024-01-16',
            time: '2:00 PM',
            status: 'pending',
            amount: 800,
            petDetails: 'Persian Cat, 2 years old'
        }
    ];
    
    displayMyBookings();
}

// Display my bookings
function displayMyBookings() {
    const container = document.getElementById('myBookings');
    if (!container) return;
    
    container.innerHTML = myBookings.map(booking => `
        <div class="recent-booking mb-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1">${booking.customerName}</h6>
                    <p class="mb-1 text-muted">${booking.serviceName}</p>
                    <small class="text-muted">${booking.petDetails}</small>
                </div>
                <span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <i class="fas fa-calendar me-2"></i>${booking.date} at ${booking.time}
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold text-primary me-3">৳${booking.amount}</span>
                    ${getBookingActions(booking)}
                </div>
            </div>
        </div>
    `).join('');
}

// Get status color for badges
function getStatusColor(status) {
    switch (status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'completed': return 'info';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

// Get booking actions based on status
function getBookingActions(booking) {
    switch (booking.status) {
        case 'pending':
            return `
                <button class="btn btn-sm btn-success me-2" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn btn-sm btn-danger" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                    <i class="fas fa-times"></i> Decline
                </button>
            `;
        case 'confirmed':
            return `
                <button class="btn btn-sm btn-primary" onclick="updateBookingStatus(${booking.id}, 'completed')">
                    <i class="fas fa-check-double"></i> Mark Complete
                </button>
            `;
        default:
            return '';
    }
}

// Load my reviews
function loadMyReviews() {
    // Mock data for reviews
    myReviews = [
        {
            id: 1,
            customerName: 'Ahmed Khan',
            rating: 5,
            comment: 'Excellent service! My dog loved the walk and Sarah was very professional.',
            date: '2024-01-10',
            serviceName: 'Dog Walking Service'
        },
        {
            id: 2,
            customerName: 'Fatima Rahman',
            rating: 4,
            comment: 'Very reliable pet sitter. Will definitely use again.',
            date: '2024-01-08',
            serviceName: 'Pet Sitting'
        }
    ];
    
    displayMyReviews();
}

// Display my reviews
function displayMyReviews() {
    const container = document.getElementById('myReviews');
    if (!container) return;
    
    container.innerHTML = myReviews.map(review => `
        <div class="review-item mb-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1">${review.customerName}</h6>
                    <p class="mb-1 text-muted">${review.serviceName}</p>
                </div>
                <div class="text-warning">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p class="mb-2">${review.comment}</p>
            <small class="text-muted">${review.date}</small>
        </div>
    `).join('');
}

// Update dashboard statistics
function updateDashboardStats() {
    // Calculate statistics
    const totalServices = myServices.length;
    const activeServices = myServices.filter(s => s.status === 'active').length;
    const totalBookings = myBookings.length;
    const pendingBookings = myBookings.filter(b => b.status === 'pending').length;
    const totalEarnings = myBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0);
    const averageRating = myReviews.length > 0 ? 
        (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1) : 0;
    
    // Update stats display
    updateStatDisplay('totalServices', totalServices);
    updateStatDisplay('activeServices', activeServices);
    updateStatDisplay('totalBookings', totalBookings);
    updateStatDisplay('pendingBookings', pendingBookings);
    updateStatDisplay('totalEarnings', totalEarnings);
    updateStatDisplay('averageRating', averageRating);
}

// Update stat display
function updateStatDisplay(statId, value) {
    const element = document.getElementById(statId);
    if (element) {
        if (statId === 'totalEarnings') {
            element.textContent = `৳${value}`;
        } else if (statId === 'averageRating') {
            element.textContent = value;
        } else {
            element.textContent = value;
        }
    }
}

// Handle add service form
function handleAddService(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const serviceData = {
        serviceName: formData.get('serviceName'),
        description: formData.get('description'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        availability: formData.get('availability'),
        location: formData.get('location')
    };
    
    // Validate form
    if (!validateServiceForm(serviceData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding Service...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Add new service
        const newService = {
            id: Date.now(),
            ...serviceData,
            status: 'active',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        };
        
        myServices.push(newService);
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Refresh display
        displayMyServices();
        updateDashboardStats();
        
        // Show success message
        showNotification('Service added successfully!', 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
        if (modal) {
            modal.hide();
        }
    }, 1500);
}

// Validate service form
function validateServiceForm(serviceData) {
    if (!serviceData.serviceName || !serviceData.serviceName.trim()) {
        showNotification('Please enter service name', 'warning');
        return false;
    }
    
    if (!serviceData.description || !serviceData.description.trim()) {
        showNotification('Please enter service description', 'warning');
        return false;
    }
    
    if (!serviceData.price || serviceData.price <= 0) {
        showNotification('Please enter a valid price', 'warning');
        return false;
    }
    
    if (!serviceData.category) {
        showNotification('Please select service category', 'warning');
        return false;
    }
    
    if (!serviceData.availability || !serviceData.availability.trim()) {
        showNotification('Please enter availability', 'warning');
        return false;
    }
    
    if (!serviceData.location || !serviceData.location.trim()) {
        showNotification('Please enter location', 'warning');
        return false;
    }
    
    return true;
}

// Edit service
function editService(serviceId) {
    const service = myServices.find(s => s.id === serviceId);
    if (!service) return;
    
    // Populate edit form (you would implement this)
    showNotification('Edit functionality coming soon!', 'info');
}

// Delete service
function deleteService(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        myServices = myServices.filter(s => s.id !== serviceId);
        displayMyServices();
        updateDashboardStats();
        showNotification('Service deleted successfully!', 'success');
    }
}

// Update booking status
function updateBookingStatus(bookingId, newStatus) {
    const booking = myBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    booking.status = newStatus;
    displayMyBookings();
    updateDashboardStats();
    
    const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    showNotification(`Booking ${statusText.toLowerCase()} successfully!`, 'success');
}

// Change location
function changeLocation() {
    const newLocation = prompt('Enter your location:', currentUser.location || 'Dhaka, Bangladesh');
    if (newLocation && newLocation.trim()) {
        currentUser.location = newLocation.trim();
        document.getElementById('current-location').textContent = currentUser.location;
        
        // Update stored user data
        const userData = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
        if (userData) {
            const user = JSON.parse(userData);
            user.location = currentUser.location;
            if (localStorage.getItem('petcare_user')) {
                localStorage.setItem('petcare_user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('petcare_user', JSON.stringify(user));
            }
        }
        
        showNotification('Location updated successfully!', 'success');
    }
}

// Setup notifications
function setupNotifications() {
    // Mock notifications
    notifications = [
        {
            id: 1,
            message: 'New booking request from Ahmed Khan',
            type: 'info',
            read: false,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
            id: 2,
            message: 'Payment received for Dog Walking service',
            type: 'success',
            read: false,
            timestamp: new Date(Date.now() - 7200000) // 2 hours ago
        },
        {
            id: 3,
            message: 'New review from Fatima Rahman',
            type: 'success',
            read: false,
            timestamp: new Date(Date.now() - 10800000) // 3 hours ago
        }
    ];
    
    updateNotificationCount();
}

// Update notification count
function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationCount = document.getElementById('notificationCount');
    
    if (notificationCount) {
        notificationCount.textContent = unreadCount;
        if (unreadCount === 0) {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'block';
        }
    }
}

// Mark notification as read
function markNotificationAsRead(notificationText) {
    const notification = notifications.find(n => n.message === notificationText);
    if (notification) {
        notification.read = true;
        updateNotificationCount();
    }
}

// Initialize chatbot
function initializeChatbot() {
    // Add some initial bot responses
    window.chatbotResponses = {
        'services': 'You can manage your services in the "My Services" tab. Add new services, edit existing ones, or remove services you no longer offer.',
        'bookings': 'Track all your bookings in the "My Bookings" tab. Accept, decline, or mark bookings as completed.',
        'earnings': 'View your earnings and financial overview in the dashboard. Track completed bookings and payments received.',
        'reviews': 'See customer reviews and ratings in the "Reviews" tab. Build your reputation with great service.',
        'schedule': 'Manage your availability and schedule in your service settings. Set when you\'re available for bookings.',
        'support': 'Need help? Contact our support team at support@petcarebd.com or use the contact form on our website.'
    };
}

// Toggle chatbot
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.classList.toggle('show');
}

// Handle chatbot input
function handleChatbotInput(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

// Send chatbot message
function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatbotMessage(message, 'user');
    input.value = '';
    
    // Generate bot response
    setTimeout(() => {
        const response = generateChatbotResponse(message);
        addChatbotMessage(response, 'bot');
    }, 500);
}

// Add chatbot message
function addChatbotMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate chatbot response
function generateChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        return window.chatbotResponses.services;
    } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        return window.chatbotResponses.bookings;
    } else if (lowerMessage.includes('earn') || lowerMessage.includes('money') || lowerMessage.includes('payment')) {
        return window.chatbotResponses.earnings;
    } else if (lowerMessage.includes('review') || lowerMessage.includes('rating')) {
        return window.chatbotResponses.reviews;
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('available') || lowerMessage.includes('time')) {
        return window.chatbotResponses.schedule;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return window.chatbotResponses.support;
    } else {
        return 'I\'m here to help! You can ask me about managing your services, bookings, earnings, reviews, schedule, or getting support.';
    }
}

// Update user info in UI
function updateUserInfo() {
    // Update dashboard title
    const dashboardTitle = document.querySelector('.dashboard-title');
    if (dashboardTitle) {
        const firstName = currentUser.firstName || currentUser.name.split(' ')[0];
        dashboardTitle.textContent = `Welcome back, ${firstName}! 🐾`;
    }
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

// Export functions for global access
window.toggleChatbot = toggleChatbot;
window.handleChatbotInput = handleChatbotInput;
window.sendChatbotMessage = sendChatbotMessage;
window.editService = editService;
window.deleteService = deleteService;
window.updateBookingStatus = updateBookingStatus;
window.changeLocation = changeLocation;
window.logout = logout;
