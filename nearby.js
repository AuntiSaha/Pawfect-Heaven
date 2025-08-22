// Nearby JavaScript for PetCare BD

// Global variables
let currentUser = null;
let allNearbyPlaces = [];
let filteredNearbyPlaces = [];

// Initialize nearby page
document.addEventListener('DOMContentLoaded', function() {
    initializeNearby();
});

function initializeNearby() {
    checkAuth();
    loadUserData();
    loadNearbyPlaces();
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

// Load nearby places
function loadNearbyPlaces() {
    allNearbyPlaces = [
        {
            id: 1,
            name: 'Pet Paradise Shop',
            type: 'pet-shop',
            category: 'Pet Shop',
            rating: 4.5,
            reviews: 89,
            location: 'Gulshan, Dhaka',
            distance: 1.2,
            address: 'House #45, Road #12, Gulshan-2, Dhaka',
            phone: '+880 1234-567890',
            email: 'info@petparadise.com',
            hours: '9:00 AM - 8:00 PM',
            openNow: true,
            description: 'Premium pet supplies, food, toys, and accessories',
            image: 'https://images.unsplash.com/photo-1587764379873-9783df4ef613?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            services: ['Pet Food', 'Toys', 'Accessories', 'Grooming Products'],
            verified: true
        },
        {
            id: 2,
            name: 'Animal Care Veterinary Clinic',
            type: 'veterinary',
            category: 'Veterinary Clinic',
            rating: 4.8,
            reviews: 156,
            location: 'Dhanmondi, Dhaka',
            distance: 2.1,
            address: 'House #78, Road #8, Dhanmondi, Dhaka',
            phone: '+880 1234-567891',
            email: 'contact@animalcare.com',
            hours: '24/7 Emergency Service',
            openNow: true,
            description: 'Comprehensive veterinary care with emergency services',
            image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            services: ['General Checkup', 'Surgery', 'Vaccination', 'Emergency Care'],
            verified: true
        },
        {
            id: 3,
            name: 'Furry Friends Grooming',
            type: 'grooming',
            category: 'Grooming Center',
            rating: 4.6,
            reviews: 73,
            location: 'Banani, Dhaka',
            distance: 3.5,
            address: 'House #23, Road #11, Banani, Dhaka',
            phone: '+880 1234-567892',
            email: 'hello@furryfriends.com',
            hours: '8:00 AM - 7:00 PM',
            openNow: false,
            description: 'Professional pet grooming and spa services',
            image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            services: ['Bathing', 'Haircut', 'Nail Trimming', 'Spa Treatment'],
            verified: true
        },
        {
            id: 4,
            name: 'Smart Paws Training',
            type: 'training',
            category: 'Training Center',
            rating: 4.7,
            reviews: 94,
            location: 'Uttara, Dhaka',
            distance: 4.8,
            address: 'House #67, Road #15, Uttara, Dhaka',
            phone: '+880 1234-567893',
            email: 'train@smartpaws.com',
            hours: '7:00 AM - 6:00 PM',
            openNow: true,
            description: 'Professional dog training and behavior modification',
            image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            services: ['Obedience Training', 'Behavior Modification', 'Puppy Training', 'Agility'],
            verified: true
        },
        {
            id: 5,
            name: 'Pet Express Mart',
            type: 'pet-shop',
            category: 'Pet Shop',
            rating: 4.3,
            reviews: 67,
            location: 'Mirpur, Dhaka',
            distance: 5.2,
            address: 'House #34, Road #6, Mirpur-10, Dhaka',
            phone: '+880 1234-567894',
            email: 'sales@petexpress.com',
            hours: '8:00 AM - 9:00 PM',
            openNow: true,
            description: 'One-stop shop for all pet needs',
            image: 'https://images.unsplash.com/photo-1587764379873-9783df4ef613?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            services: ['Pet Food', 'Medicines', 'Equipment', 'Consultation'],
            verified: false
        }
    ];
    
    filteredNearbyPlaces = [...allNearbyPlaces];
    displayNearbyPlaces();
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchNearby, 300));
    }
    
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            sortNearbyPlaces(this.value);
        });
    }
}

// Display nearby places
function displayNearbyPlaces() {
    const container = document.getElementById('nearbyContainer');
    
    if (filteredNearbyPlaces.length === 0) {
        container.innerHTML = '<div class="text-center py-4"><h5 class="text-muted">No places found</h5><p class="text-muted">Try adjusting your filters</p></div>';
        return;
    }
    
    const placesHTML = filteredNearbyPlaces.map(place => createNearbyCard(place)).join('');
    container.innerHTML = placesHTML;
}

// Create nearby place card
function createNearbyCard(place) {
    const openStatus = place.openNow ? 
        '<span class="badge bg-success">Open Now</span>' : 
        '<span class="badge bg-secondary">Closed</span>';
    
    const verifiedBadge = place.verified ? 
        '<span class="badge bg-primary ms-2">Verified</span>' : '';
    
    return `
        <div class="nearby-card mb-3">
            <div class="row">
                <div class="col-md-3">
                    <img src="${place.image}" alt="${place.name}" class="img-fluid rounded" style="width: 100%; height: 150px; object-fit: cover;">
                </div>
                <div class="col-md-9">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="nearby-name mb-1">${place.name}</h5>
                            <p class="nearby-type mb-1">${place.category}</p>
                        </div>
                        <div>
                            ${openStatus}
                            ${verifiedBadge}
                        </div>
                    </div>
                    
                    <div class="nearby-rating mb-2">
                        <span class="stars text-warning">${'★'.repeat(Math.floor(place.rating))}${'☆'.repeat(5 - Math.floor(place.rating))}</span>
                        <span class="rating-text ms-2">${place.rating} (${place.reviews} reviews)</span>
                    </div>
                    
                    <p class="text-muted mb-2">${place.description}</p>
                    
                    <div class="nearby-address mb-2">
                        <i class="fas fa-map-marker-alt text-danger me-2"></i>
                        ${place.address} • ${place.distance} km away
                    </div>
                    
                    <div class="nearby-address mb-2">
                        <i class="fas fa-clock text-primary me-2"></i>
                        ${place.hours}
                    </div>
                    
                    <div class="nearby-actions">
                        <button class="btn btn-outline-primary btn-sm" onclick="callPlace('${place.phone}')">
                            <i class="fas fa-phone me-1"></i>Call Now
                        </button>
                        <button class="btn btn-outline-info btn-sm" onclick="getDirections('${place.address}')">
                            <i class="fas fa-directions me-1"></i>Directions
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="viewDetails(${place.id})">
                            <i class="fas fa-info-circle me-1"></i>Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Search nearby places
function searchNearby() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredNearbyPlaces = [...allNearbyPlaces];
    } else {
        filteredNearbyPlaces = allNearbyPlaces.filter(place => 
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            place.address.toLowerCase().includes(searchTerm)
        );
    }
    
    displayNearbyPlaces();
}

// Apply filters
function applyFilters() {
    const types = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.value !== 'open-now') {
            types.push(checkbox.value);
        }
    });
    
    const maxDistance = parseInt(document.getElementById('maxDistance').value);
    const minRating = parseFloat(document.getElementById('minRating').value);
    const openNow = document.getElementById('openNow').checked;
    
    filteredNearbyPlaces = allNearbyPlaces.filter(place => {
        if (types.length > 0 && !types.includes(place.type)) {
            return false;
        }
        
        if (place.distance > maxDistance) {
            return false;
        }
        
        if (place.rating < minRating) {
            return false;
        }
        
        if (openNow && !place.openNow) {
            return false;
        }
        
        return true;
    });
    
    displayNearbyPlaces();
}

// Clear filters
function clearFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    document.getElementById('maxDistance').value = 5;
    document.getElementById('minRating').value = 4;
    document.getElementById('searchInput').value = '';
    
    filteredNearbyPlaces = [...allNearbyPlaces];
    displayNearbyPlaces();
}

// Sort nearby places
function sortNearbyPlaces(sortType) {
    switch (sortType) {
        case 'distance':
            filteredNearbyPlaces.sort((a, b) => a.distance - b.distance);
            break;
        case 'rating':
            filteredNearbyPlaces.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredNearbyPlaces.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    displayNearbyPlaces();
}

// Refresh nearby places
function refreshNearby() {
    const container = document.getElementById('nearbyContainer');
    container.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i><p class="mt-2">Refreshing...</p></div>';
    
    setTimeout(() => {
        loadNearbyPlaces();
    }, 1000);
}

// Quick action functions
function findNearestVet() {
    const vets = allNearbyPlaces.filter(place => place.type === 'veterinary');
    if (vets.length === 0) {
        showNotification('No veterinary clinics found nearby', 'warning');
        return;
    }
    
    const nearestVet = vets.reduce((nearest, current) => 
        current.distance < nearest.distance ? current : nearest
    );
    
    showNotification(`Nearest vet: ${nearestVet.name} (${nearestVet.distance} km away)`, 'info');
    
    // Scroll to the nearest vet in the list
    const vetElement = document.querySelector(`[data-place-id="${nearestVet.id}"]`);
    if (vetElement) {
        vetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function findPetSupplies() {
    const petShops = allNearbyPlaces.filter(place => place.type === 'pet-shop');
    if (petShops.length === 0) {
        showNotification('No pet shops found nearby', 'warning');
        return;
    }
    
    const nearestShop = petShops.reduce((nearest, current) => 
        current.distance < nearest.distance ? current : nearest
    );
    
    showNotification(`Nearest pet shop: ${nearestShop.name} (${nearestShop.distance} km away)`, 'info');
}

function findEmergencyServices() {
    const emergencyServices = allNearbyPlaces.filter(place => 
        place.type === 'veterinary' && place.hours.includes('24/7')
    );
    
    if (emergencyServices.length === 0) {
        showNotification('No 24/7 emergency services found nearby', 'warning');
        return;
    }
    
    const nearestEmergency = emergencyServices.reduce((nearest, current) => 
        current.distance < nearest.distance ? current : nearest
    );
    
    showNotification(`Emergency service: ${nearestEmergency.name} (${nearestEmergency.distance} km away)`, 'info');
}

// Action functions
function callPlace(phone) {
    showNotification(`Calling ${phone}...`, 'info');
    
    // In a real app, this would initiate a phone call
    setTimeout(() => {
        showNotification('Call initiated successfully', 'success');
    }, 1000);
}

function getDirections(address) {
    showNotification(`Getting directions to ${address}...`, 'info');
    
    // In a real app, this would open Google Maps with directions
    setTimeout(() => {
        showNotification('Directions opened in maps', 'success');
    }, 1000);
}

function viewDetails(placeId) {
    const place = allNearbyPlaces.find(p => p.id === placeId);
    if (!place) return;
    
    // Create and show details modal
    const modalHTML = `
        <div class="modal fade" id="placeDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${place.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${place.image}" alt="${place.name}" class="img-fluid rounded mb-3">
                                <h6>Services Offered:</h6>
                                <ul class="list-unstyled">
                                    ${place.services.map(service => `<li><i class="fas fa-check text-success me-2"></i>${service}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6>Contact Information:</h6>
                                <p><i class="fas fa-phone me-2"></i>${place.phone}</p>
                                <p><i class="fas fa-envelope me-2"></i>${place.email}</p>
                                <p><i class="fas fa-map-marker-alt me-2"></i>${place.address}</p>
                                <p><i class="fas fa-clock me-2"></i>${place.hours}</p>
                                <p><i class="fas fa-star me-2"></i>${place.rating} (${place.reviews} reviews)</p>
                                <p><i class="fas fa-road me-2"></i>${place.distance} km away</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h6>Description:</h6>
                            <p>${place.description}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="callPlace('${place.phone}')">
                            <i class="fas fa-phone me-2"></i>Call Now
                        </button>
                        <button type="button" class="btn btn-info" onclick="getDirections('${place.address}')">
                            <i class="fas fa-directions me-2"></i>Get Directions
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('placeDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('placeDetailsModal'));
    modal.show();
}

// Initialize chatbot
function initializeChatbot() {
    window.chatbotResponses = {
        'vet': 'I can help you find veterinary clinics nearby. Use the "Find Nearest Vet" button or check the veterinary filter.',
        'shop': 'Pet shops are available in your area. Look for places marked as "Pet Shop" in the nearby places list.',
        'emergency': 'For emergency services, use the "Emergency Services" button to find 24/7 veterinary care.',
        'grooming': 'Grooming centers are listed in the nearby places. Filter by "Grooming Centers" to see available options.'
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
    
    if (lowerMessage.includes('vet') || lowerMessage.includes('doctor') || lowerMessage.includes('clinic')) {
        return window.chatbotResponses.vet;
    } else if (lowerMessage.includes('shop') || lowerMessage.includes('store') || lowerMessage.includes('supplies')) {
        return window.chatbotResponses.shop;
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('24/7')) {
        return window.chatbotResponses.emergency;
    } else if (lowerMessage.includes('grooming') || lowerMessage.includes('bath') || lowerMessage.includes('spa')) {
        return window.chatbotResponses.grooming;
    } else {
        return 'I can help you find nearby pet shops, veterinary clinics, grooming centers, and training facilities. What are you looking for?';
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
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.searchNearby = searchNearby;
window.refreshNearby = refreshNearby;
window.findNearestVet = findNearestVet;
window.findPetSupplies = findPetSupplies;
window.findEmergencyServices = findEmergencyServices;
window.callPlace = callPlace;
window.getDirections = getDirections;
window.viewDetails = viewDetails;
window.logout = logout;
