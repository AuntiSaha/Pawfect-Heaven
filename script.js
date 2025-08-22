// Global Variables
let currentUser = null;
let isProviderMode = false;
let currentLocation = 'Dhaka, Bangladesh';
let services = [];
let nearbyPlaces = [];
let bookings = [];
let reviews = [];

// Sample Data for Demo
const sampleServices = [
    {
        id: 1,
        providerName: 'Sarah Ahmed',
        serviceType: 'Dog Walking',
        price: 500,
        rating: 4.8,
        reviews: 127,
        location: 'Gulshan, Dhaka',
        distance: '2.3 km',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional dog walking service with GPS tracking and daily reports.',
        availability: 'Mon-Sun, 6 AM-8 PM'
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
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Experienced veterinarian providing home visits and emergency care.',
        availability: 'Mon-Sat, 9 AM-6 PM'
    },
    {
        id: 3,
        providerName: 'Pet Paradise',
        serviceType: 'Grooming',
        price: 800,
        rating: 4.7,
        reviews: 156,
        location: 'Banani, Dhaka',
        distance: '3.1 km',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Professional pet grooming with premium products and experienced staff.',
        availability: 'Mon-Sat, 8 AM-7 PM'
    },
    {
        id: 4,
        providerName: 'Happy Paws',
        serviceType: 'Pet Sitting',
        price: 600,
        rating: 4.6,
        reviews: 93,
        location: 'Uttara, Dhaka',
        distance: '4.2 km',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Loving pet sitting service in your home or our facility.',
        availability: '24/7 Service'
    },
    {
        id: 5,
        providerName: 'Trainer Mike',
        serviceType: 'Training',
        price: 1200,
        rating: 4.9,
        reviews: 67,
        location: 'Mirpur, Dhaka',
        distance: '5.7 km',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: 'Certified dog trainer specializing in obedience and behavior modification.',
        availability: 'Mon-Fri, 7 AM-6 PM'
    }
];

const sampleNearbyPlaces = [
    {
        id: 1,
        name: 'Pet Care Hospital',
        type: 'Pet Hospital',
        rating: 4.8,
        reviews: 234,
        address: 'House #45, Road #12, Gulshan-2, Dhaka',
        phone: '+880 1234-567890',
        distance: '1.2 km',
        coordinates: { lat: 23.7937, lng: 90.4066 }
    },
    {
        id: 2,
        name: 'Pawsome Pet Shop',
        type: 'Pet Shop',
        rating: 4.6,
        reviews: 189,
        address: 'Shop #23, Banani Shopping Complex, Dhaka',
        phone: '+880 1234-567891',
        distance: '2.1 km',
        coordinates: { lat: 23.7937, lng: 90.4066 }
    },
    {
        id: 3,
        name: 'VetCare Clinic',
        type: 'Pet Clinic',
        rating: 4.9,
        reviews: 312,
        address: 'Road #27, Dhanmondi, Dhaka',
        phone: '+880 1234-567892',
        distance: '2.8 km',
        coordinates: { lat: 23.7937, lng: 90.4066 }
    },
    {
        id: 4,
        name: 'Pet Supplies Plus',
        type: 'Pet Shop',
        rating: 4.5,
        reviews: 156,
        address: 'Uttara Sector 7, Dhaka',
        phone: '+880 1234-567893',
        distance: '3.5 km',
        coordinates: { lat: 23.7937, lng: 90.4066 }
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load sample data
    services = [...sampleServices];
    nearbyPlaces = [...sampleNearbyPlaces];
    
    // Initialize components
    loadServices();
    loadNearbyPlaces();
    initializeChatbot();
    setupEventListeners();
    
    // Get user location if possible
    getUserLocation();
}

// Event Listeners
function setupEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submissions
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', handleAddService);
    }
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }
    
    // Newsletter subscription
    const newsletterBtn = document.querySelector('.footer .btn-primary');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', handleNewsletterSubscription);
    }
}

// Navigation Functions
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function scrollToProvider() {
    document.getElementById('provider').scrollIntoView({ behavior: 'smooth' });
}

function changeLocation() {
    const newLocation = prompt('Enter your location:', currentLocation);
    if (newLocation && newLocation.trim()) {
        currentLocation = newLocation.trim();
        document.getElementById('current-location').textContent = currentLocation;
        
        // Refresh services and nearby places based on new location
        loadServices();
        loadNearbyPlaces();
        
        showNotification('Location updated successfully!', 'success');
    }
}

// Service Management
function loadServices() {
    const container = document.getElementById('servicesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        container.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const stars = '★'.repeat(Math.floor(service.rating)) + '☆'.repeat(5 - Math.floor(service.rating));
    
    col.innerHTML = `
        <div class="service-card">
            <div class="service-card-image">
                <img src="${service.image}" alt="${service.serviceType}" loading="lazy">
            </div>
            <div class="service-card-body">
                <h5 class="service-provider-name">${service.providerName}</h5>
                <p class="service-type">${service.serviceType}</p>
                <div class="service-price">৳${service.price}</div>
                <div class="service-rating">
                    <span class="stars">${stars}</span>
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
    `;
    
    return col;
}

function searchServices() {
    const serviceType = document.getElementById('serviceType').value;
    const location = document.getElementById('locationSearch').value;
    
    let filteredServices = services;
    
    if (serviceType) {
        filteredServices = filteredServices.filter(service => 
            service.serviceType.toLowerCase().includes(serviceType.toLowerCase())
        );
    }
    
    if (location) {
        filteredServices = filteredServices.filter(service => 
            service.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Update the display
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';
    
    if (filteredServices.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No services found</h4>
                    <p class="text-muted">Try adjusting your search criteria</p>
                </div>
            </div>
        `;
    } else {
        filteredServices.forEach(service => {
            const serviceCard = createServiceCard(service);
            container.appendChild(serviceCard);
        });
    }
    
    showNotification(`Found ${filteredServices.length} services`, 'info');
}

function sortServices() {
    const sortBy = document.getElementById('sortServices').value;
    let sortedServices = [...services];
    
    switch (sortBy) {
        case 'rating':
            sortedServices.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            sortedServices.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedServices.sort((a, b) => b.price - a.price);
            break;
        case 'distance':
        default:
            // Sort by distance (simulated)
            sortedServices.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            break;
    }
    
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';
    
    sortedServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        container.appendChild(serviceCard);
    });
}

// Provider Functions
function switchRole() {
    isProviderMode = !isProviderMode;
    const btn = document.getElementById('switchRoleBtn');
    
    if (isProviderMode) {
        btn.innerHTML = '<i class="fas fa-user me-1"></i>Switch to User';
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-success');
        showNotification('Switched to Provider Mode', 'success');
    } else {
        btn.innerHTML = '<i class="fas fa-exchange-alt me-1"></i>Switch to Provider';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-primary');
        showNotification('Switched to User Mode', 'info');
    }
}

function openProviderDashboard() {
    if (!isProviderMode) {
        showNotification('Please switch to Provider Mode first', 'warning');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('providerModal'));
    modal.show();
    
    // Load provider data
    loadProviderDashboard();
}

function loadProviderDashboard() {
    // Update statistics
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('totalEarnings').textContent = `৳${bookings.reduce((sum, booking) => sum + booking.price, 0)}`;
    
    const avgRating = reviews.length > 0 ? 
        (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0';
    document.getElementById('averageRating').textContent = avgRating;
    
    document.getElementById('activeServices').textContent = services.filter(s => s.providerName === 'Current User').length;
    
    // Load bookings
    loadProviderBookings();
    
    // Load reviews
    loadProviderReviews();
}

function loadProviderBookings() {
    const container = document.getElementById('bookingsContainer');
    if (!container) return;
    
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5>No bookings yet</h5>
                <p class="text-muted">Bookings will appear here when customers book your services</p>
            </div>
        `;
    } else {
        container.innerHTML = bookings.map(booking => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h6 class="mb-1">${booking.petName}</h6>
                            <small class="text-muted">${booking.petBreed}</small>
                        </div>
                        <div class="col-md-3">
                            <span class="badge bg-primary">${booking.serviceType}</span>
                        </div>
                        <div class="col-md-2">
                            <strong>৳${booking.price}</strong>
                        </div>
                        <div class="col-md-2">
                            <small class="text-muted">${booking.date}</small>
                        </div>
                        <div class="col-md-2">
                            <span class="badge bg-success">Confirmed</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadProviderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-star fa-3x text-muted mb-3"></i>
                <h5>No reviews yet</h5>
                <p class="text-muted">Reviews will appear here after customers rate your services</p>
            </div>
        `;
    } else {
        container.innerHTML = reviews.map(review => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                        <div class="stars me-2">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                        <small class="text-muted">${review.date}</small>
                    </div>
                    <p class="mb-1">${review.comment}</p>
                    <small class="text-muted">- ${review.customerName}</small>
                </div>
            </div>
        `).join('');
    }
}

function handleAddService(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const serviceData = {
        id: Date.now(),
        providerName: 'Current User',
        serviceType: formData.get('serviceType') || 'Custom Service',
        price: parseInt(formData.get('price')) || 0,
        rating: 0,
        reviews: 0,
        location: formData.get('location') || 'Your Location',
        distance: '0 km',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        description: formData.get('description') || 'Service description',
        availability: formData.get('availability') || 'Flexible'
    };
    
    // Add to services
    services.push(serviceData);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showNotification('Service added successfully!', 'success');
    
    // Refresh dashboard
    loadProviderDashboard();
}

// Nearby Places Functions
function loadNearbyPlaces() {
    const container = document.getElementById('nearbyContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    nearbyPlaces.forEach(place => {
        const placeCard = createNearbyCard(place);
        container.appendChild(placeCard);
    });
}

function createNearbyCard(place) {
    const div = document.createElement('div');
    div.className = 'nearby-card';
    
    const stars = '★'.repeat(Math.floor(place.rating)) + '☆'.repeat(5 - Math.floor(place.rating));
    
    div.innerHTML = `
        <div class="nearby-name">${place.name}</div>
        <div class="nearby-type">${place.type}</div>
        <div class="nearby-rating">
            <span class="stars">${stars}</span>
            <span class="rating-text">${place.rating} (${place.reviews} reviews)</span>
        </div>
        <div class="nearby-address">
            <i class="fas fa-map-marker-alt"></i>
            ${place.address} • ${place.distance}
        </div>
        <div class="nearby-actions">
            <a href="tel:${place.phone}" class="btn btn-primary">
                <i class="fas fa-phone me-2"></i>Call Now
            </a>
            <a href="https://maps.google.com/?q=${encodeURIComponent(place.address)}" 
               target="_blank" class="btn btn-outline-primary">
                <i class="fas fa-map me-2"></i>Directions
            </a>
        </div>
    `;
    
    return div;
}

function refreshNearby() {
    const sortBy = document.getElementById('nearbySort').value;
    const typeFilter = document.getElementById('nearbyType').value;
    
    let filteredPlaces = [...nearbyPlaces];
    
    if (typeFilter) {
        filteredPlaces = filteredPlaces.filter(place => 
            place.type.toLowerCase().includes(typeFilter.toLowerCase())
        );
    }
    
    // Sort places
    if (sortBy === 'rating') {
        filteredPlaces.sort((a, b) => b.rating - a.rating);
    } else {
        filteredPlaces.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    
    const container = document.getElementById('nearbyContainer');
    container.innerHTML = '';
    
    filteredPlaces.forEach(place => {
        const placeCard = createNearbyCard(place);
        container.appendChild(placeCard);
    });
    
    showNotification('Nearby places refreshed', 'info');
}

// Booking Functions
function bookService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    // Store service info for booking
    window.currentBookingService = service;
    
    // Show booking modal
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

function handleBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const service = window.currentBookingService;
    
    const booking = {
        id: Date.now(),
        serviceId: service.id,
        serviceType: service.serviceType,
        providerName: service.providerName,
        price: service.price,
        petName: formData.get('petName') || 'Unknown',
        petBreed: formData.get('petBreed') || 'Unknown',
        petAge: formData.get('petAge') || 0,
        date: formData.get('date') || 'TBD',
        time: formData.get('time') || 'TBD',
        specialInstructions: formData.get('specialInstructions') || '',
        status: 'Confirmed'
    };
    
    // Add to bookings
    bookings.push(booking);
    
    // Reset form
    event.target.reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();
    
    // Show success message
    showNotification('Booking confirmed successfully!', 'success');
    
    // Update provider dashboard if in provider mode
    if (isProviderMode) {
        loadProviderDashboard();
    }
}

// Contact Functions
function contactProvider(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    showNotification(`Contacting ${service.providerName}...`, 'info');
    
    // Simulate contact action
    setTimeout(() => {
        showNotification(`Contact information sent to ${service.providerName}`, 'success');
    }, 1000);
}

function handleContactForm(event) {
    event.preventDefault();
    
    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        event.target.reset();
        
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    }, 2000);
}

// Newsletter Subscription
function handleNewsletterSubscription() {
    const emailInput = document.querySelector('.footer input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }
    
    emailInput.value = '';
    showNotification('Thank you for subscribing to our newsletter!', 'success');
}

// Chatbot Functions
function initializeChatbot() {
    // Add some initial bot responses
    window.chatbotResponses = {
        'services': 'We offer various pet care services including dog walking, pet sitting, grooming, training, and veterinary care. You can browse all services on our Services page.',
        'booking': 'To book a service, simply click the "Book Now" button on any service card. You\'ll need to provide your pet\'s details and preferred date/time.',
        'provider': 'To become a service provider, click "Switch to Provider" in the navigation bar, then click "Start Offering Services" to create your first service listing.',
        'nearby': 'You can find nearby pet shops and hospitals on our "Nearby Pet Shops & Hospitals" page. We also show them on a map for easy navigation.',
        'contact': 'You can reach us at +880 1234-567890 or email us at info@petcarebd.com. We\'re also available through the contact form on our website.',
        'pricing': 'Our service prices vary depending on the type of service and provider. You can see individual prices on each service card, and sort by price using our filters.',
        'verification': 'All our service providers go through a thorough verification process including background checks and reference verification to ensure your pet\'s safety.'
    };
}

function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.classList.toggle('show');
}

function handleChatbotInput(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

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

function addChatbotMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        return window.chatbotResponses.services;
    } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        return window.chatbotResponses.booking;
    } else if (lowerMessage.includes('provider') || lowerMessage.includes('work')) {
        return window.chatbotResponses.provider;
    } else if (lowerMessage.includes('nearby') || lowerMessage.includes('shop') || lowerMessage.includes('hospital')) {
        return window.chatbotResponses.nearby;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        return window.chatbotResponses.contact;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('৳')) {
        return window.chatbotResponses.pricing;
    } else if (lowerMessage.includes('verify') || lowerMessage.includes('safe') || lowerMessage.includes('trust')) {
        return window.chatbotResponses.verification;
    } else {
        return 'I\'m here to help! You can ask me about our services, booking process, becoming a provider, finding nearby pet shops, contact information, pricing, or provider verification.';
    }
}

// Utility Functions
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Convert coordinates to city name (simplified)
                const city = getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
                if (city) {
                    currentLocation = city;
                    document.getElementById('current-location').textContent = currentLocation;
                }
            },
            function(error) {
                console.log('Location access denied or error occurred');
            }
        );
    }
}

function getCityFromCoordinates(lat, lng) {
    // Simplified function - in a real app, you'd use a reverse geocoding service
    // For demo purposes, we'll return a nearby city based on coordinates
    if (lat >= 23.7 && lat <= 23.9 && lng >= 90.3 && lng <= 90.5) {
        return 'Dhaka, Bangladesh';
    } else if (lat >= 22.3 && lat <= 22.4 && lng >= 91.8 && lng <= 91.9) {
        return 'Chittagong, Bangladesh';
    } else if (lat >= 24.3 && lat <= 24.4 && lng >= 88.6 && lng <= 88.7) {
        return 'Rajshahi, Bangladesh';
    }
    return null;
}

// Smooth scrolling for all internal links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('shadow');
    }
});

// Add animation classes to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .nearby-card, .provider-image, .hero-image');
    animateElements.forEach(el => observer.observe(el));
});

// Handle form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Add form validation to all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'warning');
            }
        });
    });
});

// Export functions for global access
window.scrollToServices = scrollToServices;
window.scrollToProvider = scrollToProvider;
window.changeLocation = changeLocation;
window.searchServices = searchServices;
window.sortServices = sortServices;
window.switchRole = switchRole;
window.openProviderDashboard = openProviderDashboard;
window.bookService = bookService;
window.contactProvider = contactProvider;
window.refreshNearby = refreshNearby;
window.toggleChatbot = toggleChatbot;
window.handleChatbotInput = handleChatbotInput;
window.sendChatbotMessage = sendChatbotMessage;
