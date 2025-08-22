// User Dashboard JavaScript for PetCare BD

// Global variables
let currentUser = null;
let notifications = [];
let recommendedServices = [];

// Initialize user dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeUserDashboard();
});

function initializeUserDashboard() {
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
    
    // Check if user is actually a user (not provider)
    if (currentUser.type === 'provider') {
        window.location.href = 'provider-dashboard.html';
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
    // Load recommended services
    loadRecommendedServices();
    
    // Load recent bookings
    loadRecentBookings();
    
    // Update statistics
    updateDashboardStats();
}

// Load recommended services
function loadRecommendedServices() {
    // Mock data for recommended services
    recommendedServices = [
        {
            id: 1,
            providerName: 'Sarah Ahmed',
            serviceType: 'Dog Walking',
            price: 500,
            rating: 4.8,
            reviews: 127,
            location: 'Gulshan, Dhaka',
            distance: '2.3 km',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
            id: 2,
            providerName: 'Dr. Rahman',
            serviceType: 'Veterinary Care',
            price: 1500,
            rating: 4.9,
            reviews: 89,
            location: 'Dhanmondi, Dhaka',
            distance: '1.8 km',
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        }
    ];
    
    displayRecommendedServices();
}

// Display recommended services
function displayRecommendedServices() {
    const container = document.getElementById('recommendedServices');
    if (!container) return;
    
    container.innerHTML = recommendedServices.map(service => `
        <div class="col-lg-6 col-md-12 mb-3">
            <div class="service-card">
                <div class="service-card-image">
                    <img src="${service.image}" alt="${service.serviceType}" loading="lazy">
                </div>
                <div class="service-card-body">
                    <h5 class="service-provider-name">${service.providerName}</h5>
                    <p class="service-type">${service.serviceType}</p>
                    <div class="service-price">৳${service.price}</div>
                    <div class="service-rating">
                        <span class="stars">${'★'.repeat(Math.floor(service.rating))}${'☆'.repeat(5 - Math.floor(service.rating))}</span>
                        <span class="rating-text">${service.rating} (${service.reviews} reviews)</span>
                    </div>
                    <div class="service-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${service.location} • ${service.distance}
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-outline-primary" onclick="contactProvider(${service.id})">
                            <i class="fas fa-phone me-2"></i>Contact
                        </button>
                        <button class="btn btn-primary" onclick="bookService(${service.id})">
                            <i class="fas fa-calendar-check me-2"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load recent bookings
function loadRecentBookings() {
    // This would typically load from an API
    // For now, we'll use the static HTML content
}

// Update dashboard statistics
function updateDashboardStats() {
    // This would typically update from real data
    // For now, we'll use the static HTML content
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
        
        // Refresh services based on new location
        loadRecommendedServices();
    }
}

// Setup notifications
function setupNotifications() {
    // Mock notifications
    notifications = [
        {
            id: 1,
            message: 'New service available in your area',
            type: 'info',
            read: false,
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
            id: 2,
            message: 'Your booking with Sarah Ahmed is confirmed',
            type: 'success',
            read: false,
            timestamp: new Date(Date.now() - 7200000) // 2 hours ago
        },
        {
            id: 3,
            message: 'Payment received for grooming service',
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

// Contact provider
function contactProvider(serviceId) {
    const service = recommendedServices.find(s => s.id === serviceId);
    if (!service) return;
    
    showNotification(`Contacting ${service.providerName}...`, 'info');
    
    // Simulate contact action
    setTimeout(() => {
        showNotification(`Contact information sent to ${service.providerName}`, 'success');
    }, 1000);
}

// Book service
function bookService(serviceId) {
    const service = recommendedServices.find(s => s.id === serviceId);
    if (!service) return;
    
    // Redirect to services page for booking
    window.location.href = `services.html?service=${serviceId}`;
}

// Initialize chatbot
function initializeChatbot() {
    // Add some initial bot responses
    window.chatbotResponses = {
        'services': 'We offer various pet care services including dog walking, pet sitting, grooming, training, and veterinary care. You can browse all services on our Services page.',
        'booking': 'To book a service, simply click the "Book Now" button on any service card. You\'ll need to provide your pet\'s details and preferred date/time.',
        'nearby': 'You can find nearby pet shops and hospitals on our "Nearby Pet Shops & Hospitals" page. We also show them on a map for easy navigation.',
        'contact': 'You can reach us at +880 1234-567890 or email us at info@petcarebd.com. We\'re also available through the contact form on our website.',
        'pricing': 'Our service prices vary depending on the type of service and provider. You can see individual prices on each service card, and sort by price using our filters.',
        'verification': 'All our service providers go through a thorough verification process including background checks and reference verification to ensure your pet\'s safety.'
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
        return window.chatbotResponses.booking;
    } else if (lowerMessage.includes('nearby') || lowerMessage.includes('shop') || lowerMessage.includes('hospital')) {
        return window.chatbotResponses.nearby;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        return window.chatbotResponses.contact;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('৳')) {
        return window.chatbotResponses.pricing;
    } else if (lowerMessage.includes('verify') || lowerMessage.includes('safe') || lowerMessage.includes('trust')) {
        return window.chatbotResponses.verification;
    } else {
        return 'I\'m here to help! You can ask me about our services, booking process, finding nearby pet shops, contact information, pricing, or provider verification.';
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
window.contactProvider = contactProvider;
window.bookService = bookService;
window.changeLocation = changeLocation;
window.logout = logout;
