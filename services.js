// Services JavaScript for PetCare BD

// Global variables
let currentUser = null;
let allServices = [];
let filteredServices = [];

// Initialize services page
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
});

function initializeServices() {
    checkAuth();
    loadUserData();
    loadServices();
    setupEventListeners();
    initializeChatbot();
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
}

// Load user data
function loadUserData() {
    if (currentUser.location) {
        document.getElementById('current-location').textContent = currentUser.location;
    }
}

// Load services
function loadServices() {
    allServices = [
        {
            id: 1,
            providerName: 'Sarah Ahmed',
            serviceType: 'Dog Walking',
            category: 'dog-walking',
            price: 500,
            rating: 4.8,
            reviews: 127,
            location: 'Gulshan, Dhaka',
            distance: 2.3,
            description: 'Professional dog walking service with GPS tracking.',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            verified: true
        },
        {
            id: 2,
            providerName: 'Dr. Rahman',
            serviceType: 'Veterinary Care',
            category: 'veterinary',
            price: 1500,
            rating: 4.9,
            reviews: 89,
            location: 'Dhanmondi, Dhaka',
            distance: 1.8,
            description: 'Experienced veterinarian providing comprehensive pet care.',
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            verified: true
        }
    ];
    
    filteredServices = [...allServices];
    displayServices();
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchServices, 300));
    }
}

// Display services
function displayServices() {
    const container = document.getElementById('servicesContainer');
    
    if (filteredServices.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><h4>No services found</h4></div>';
        return;
    }
    
    const servicesHTML = filteredServices.map(service => createServiceCard(service)).join('');
    container.innerHTML = servicesHTML;
}

// Create service card HTML
function createServiceCard(service) {
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="service-card h-100">
                <div class="service-card-image">
                    <img src="${service.image}" alt="${service.serviceType}" loading="lazy">
                    ${service.verified ? '<span class="badge bg-success position-absolute top-0 end-0 m-2">Verified</span>' : ''}
                </div>
                <div class="service-card-body d-flex flex-column">
                    <h5 class="service-provider-name">${service.providerName}</h5>
                    <p class="service-type">${service.serviceType}</p>
                    <p class="text-muted small mb-2">${service.description}</p>
                    
                    <div class="service-price">৳${service.price}</div>
                    
                    <div class="service-rating">
                        <span class="stars">${'★'.repeat(Math.floor(service.rating))}${'☆'.repeat(5 - Math.floor(service.rating))}</span>
                        <span class="rating-text">${service.rating} (${service.reviews} reviews)</span>
                    </div>
                    
                    <div class="service-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${service.location} • ${service.distance} km
                    </div>
                    
                    <div class="mt-auto">
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
        </div>
    `;
}

// Search services
function searchServices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredServices = [...allServices];
    } else {
        filteredServices = allServices.filter(service => 
            service.providerName.toLowerCase().includes(searchTerm) ||
            service.serviceType.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayServices();
}

// Apply filters
function applyFilters() {
    // Get filter values
    const serviceTypes = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.value !== 'immediate' && checkbox.value !== 'today' && checkbox.value !== 'week') {
            serviceTypes.push(checkbox.value);
        }
    });
    
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || 5000;
    
    // Filter services
    filteredServices = allServices.filter(service => {
        if (serviceTypes.length > 0 && !serviceTypes.includes(service.category)) {
            return false;
        }
        
        if (service.price < minPrice || service.price > maxPrice) {
            return false;
        }
        
        return true;
    });
    
    displayServices();
}

// Clear filters
function clearFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 5000;
    document.getElementById('searchInput').value = '';
    
    filteredServices = [...allServices];
    displayServices();
}

// Contact provider
function contactProvider(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    showNotification(`Contacting ${service.providerName}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Contact information sent to ${service.providerName}`, 'success');
    }, 1000);
}

// Book service
function bookService(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    loadBookingForm(service);
    
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

// Load booking form
function loadBookingForm(service) {
    const formContainer = document.getElementById('bookingForm');
    
    // Load user pets
    const userPets = getUserPets();
    
    const petSelectOptions = userPets.length > 0 ? 
        userPets.map(pet => `<option value="${pet.id}">${pet.name} (${pet.type})</option>`).join('') :
        '<option value="">No pets found - Add pets in your profile first</option>';
    
    formContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Service Details</h6>
                        <h6 class="mb-1">${service.providerName}</h6>
                        <p class="mb-1 text-muted">${service.serviceType}</p>
                        <span class="badge bg-primary">৳${service.price}</span>
                        <p class="text-muted small mt-2">${service.description}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <form id="serviceBookingForm">
                    <div class="mb-3">
                        <label class="form-label">Select Pet *</label>
                        <select class="form-select" id="selectedPet" required>
                            <option value="">Choose your pet</option>
                            ${petSelectOptions}
                        </select>
                        ${userPets.length === 0 ? 
                            '<small class="text-muted">You need to add pets first. <a href="pets.html">Add pets here</a>.</small>' : 
                            ''}
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Preferred Date *</label>
                        <input type="date" class="form-control" id="preferredDate" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Preferred Time</label>
                        <select class="form-select" id="preferredTime">
                            <option value="">Select time (optional)</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Special Instructions</label>
                        <textarea class="form-control" id="specialInstructions" rows="3" placeholder="Any special requirements for your pet..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" ${userPets.length === 0 ? 'disabled' : ''}>
                        <i class="fas fa-calendar-check me-2"></i>Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    `;
    
    const form = document.getElementById('serviceBookingForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingSubmission(service);
    });
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').min = today;
}

// Get user pets
function getUserPets() {
    // Mock pet data - in a real app, this would come from the pets.js or API
    return [
        { id: 1, name: "Max", type: "dog" },
        { id: 2, name: "Luna", type: "cat" },
        { id: 3, name: "Charlie", type: "bird" }
    ];
}

// Handle booking submission
function handleBookingSubmission(service) {
    const selectedPetId = document.getElementById('selectedPet').value;
    const userPets = getUserPets();
    const selectedPet = userPets.find(pet => pet.id == selectedPetId);
    
    const formData = {
        petId: selectedPetId,
        petName: selectedPet ? selectedPet.name : '',
        petType: selectedPet ? selectedPet.type : '',
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value,
        specialInstructions: document.getElementById('specialInstructions').value
    };
    
    if (!validateBookingForm(formData)) {
        return;
    }
    
    const submitBtn = document.querySelector('#serviceBookingForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const booking = {
            id: Date.now(),
            serviceId: service.id,
            serviceName: service.serviceType,
            providerName: service.providerName,
            customerId: currentUser.id,
            customerName: currentUser.firstName + ' ' + currentUser.lastName,
            ...formData,
            status: 'pending',
            amount: service.price,
            createdAt: new Date().toISOString()
        };
        
        const existingBookings = JSON.parse(localStorage.getItem('petcare_bookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('petcare_bookings', JSON.stringify(existingBookings));
        
        submitBtn.innerHTML = '<i class="fas fa-calendar-check me-2"></i>Confirm Booking';
        submitBtn.disabled = false;
        
        showNotification('Booking submitted successfully!', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        modal.hide();
        
        document.getElementById('serviceBookingForm').reset();
        
    }, 2000);
}

// Validate booking form
function validateBookingForm(formData) {
    if (!formData.petId) {
        showNotification('Please select a pet for this service', 'warning');
        return false;
    }
    
    if (!formData.preferredDate) {
        showNotification('Please select a preferred date', 'warning');
        return false;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date', 'warning');
        return false;
    }
    
    return true;
}

// Initialize chatbot
function initializeChatbot() {
    window.chatbotResponses = {
        'service': 'We offer various pet care services. Use the filters on the left to find specific services.',
        'book': 'To book a service, click the "Book Now" button on any service card.',
        'price': 'Service prices vary by type and provider. See individual prices on each service card.'
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
    
    addChatbotMessage(message, 'user');
    input.value = '';
    
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
    
    if (lowerMessage.includes('service')) {
        return window.chatbotResponses.service;
    } else if (lowerMessage.includes('book')) {
        return window.chatbotResponses.book;
    } else if (lowerMessage.includes('price')) {
        return window.chatbotResponses.price;
    } else {
        return 'I\'m here to help! Ask me about services, booking, or pricing.';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

// Export functions for global access
window.toggleChatbot = toggleChatbot;
window.handleChatbotInput = handleChatbotInput;
window.sendChatbotMessage = sendChatbotMessage;
window.contactProvider = contactProvider;
window.bookService = bookService;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.searchServices = searchServices;
window.logout = logout;
