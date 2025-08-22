// Bookings Page JavaScript
let currentUser = null;
let allBookings = [];
let filteredBookings = [];
let currentBookingId = null;

// Initialize the bookings page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserBookings();
    setupLocationServices();
    updateBookingStats();
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
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = 'login.html';
    }
}

// Load user bookings
function loadUserBookings() {
    // Mock data - in real app, this would come from API
    allBookings = [
        {
            id: 1,
            serviceType: 'Dog Walking',
            providerName: 'Sarah Ahmed',
            providerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            petName: 'Buddy',
            petType: 'Dog',
            date: '2024-01-15',
            time: '09:00',
            duration: '1 hour',
            price: 500,
            status: 'confirmed',
            location: 'Gulshan, Dhaka',
            description: 'Regular dog walking service with GPS tracking',
            notes: 'Buddy loves playing fetch, please bring his favorite ball',
            providerPhone: '+880 1234-567890',
            providerEmail: 'sarah.ahmed@email.com',
            bookingDate: '2024-01-10',
            paymentStatus: 'paid'
        },
        {
            id: 2,
            serviceType: 'Veterinary Care',
            providerName: 'Dr. Rahman',
            providerImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            petName: 'Whiskers',
            petType: 'Cat',
            date: '2024-01-18',
            time: '14:00',
            duration: '2 hours',
            price: 1500,
            status: 'pending',
            location: 'Dhanmondi, Dhaka',
            description: 'Annual health checkup and vaccination',
            notes: 'Whiskers is due for her annual vaccination',
            providerPhone: '+880 1234-567891',
            providerEmail: 'dr.rahman@animalcare.com',
            bookingDate: '2024-01-12',
            paymentStatus: 'pending'
        },
        {
            id: 3,
            serviceType: 'Pet Sitting',
            providerName: 'Fatima Khan',
            providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            petName: 'Buddy & Whiskers',
            petType: 'Dog & Cat',
            date: '2024-01-20',
            time: '08:00',
            duration: '8 hours',
            price: 800,
            status: 'completed',
            location: 'Gulshan, Dhaka',
            description: 'Full-day pet sitting while owner is away',
            notes: 'Both pets need regular feeding and bathroom breaks',
            providerPhone: '+880 1234-567892',
            providerEmail: 'fatima.khan@email.com',
            bookingDate: '2024-01-08',
            paymentStatus: 'paid'
        },
        {
            id: 4,
            serviceType: 'Grooming',
            providerName: 'Pet Beauty Salon',
            providerImage: 'https://images.unsplash.com/photo-1587764379873-9783df4ef613?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            petName: 'Whiskers',
            petType: 'Cat',
            date: '2024-01-22',
            time: '10:00',
            duration: '3 hours',
            price: 1200,
            status: 'in-progress',
            location: 'Banani, Dhaka',
            description: 'Full grooming service including bath, trim, and nail clipping',
            notes: 'Whiskers is sensitive to loud noises, please be gentle',
            providerPhone: '+880 1234-567893',
            providerEmail: 'info@petbeauty.com',
            bookingDate: '2024-01-14',
            paymentStatus: 'paid'
        }
    ];
    
    filteredBookings = [...allBookings];
    displayBookings();
}

// Display bookings
function displayBookings() {
    const container = document.getElementById('bookingsContainer');
    if (!container) return;
    
    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No bookings found</h5>
                <p class="text-muted">Try adjusting your filters or book a new service</p>
                <button class="btn btn-primary" onclick="bookNewService()">
                    <i class="fas fa-plus me-2"></i>Book New Service
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredBookings.map(booking => `
        <div class="card mb-3 booking-card">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center">
                        <img src="${booking.providerImage}" alt="${booking.providerName}" 
                             class="rounded-circle mb-2" style="width: 60px; height: 60px; object-fit: cover;">
                        <div class="badge bg-${getStatusColor(booking.status)}">${getStatusText(booking.status)}</div>
                    </div>
                    <div class="col-md-6">
                        <h6 class="card-title mb-1">${booking.serviceType}</h6>
                        <p class="text-muted mb-1">
                            <i class="fas fa-user me-1"></i>${booking.providerName} • 
                            <i class="fas fa-paw me-1"></i>${booking.petName} (${booking.petType})
                        </p>
                        <p class="text-muted mb-1">
                            <i class="fas fa-calendar me-1"></i>${formatDate(booking.date)} at ${booking.time} • 
                            <i class="fas fa-clock me-1"></i>${booking.duration}
                        </p>
                        <p class="text-muted mb-0">
                            <i class="fas fa-map-marker-alt me-1"></i>${booking.location}
                        </p>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="fw-bold text-primary mb-1">৳${booking.price}</div>
                        <small class="text-muted">${getPaymentStatusText(booking.paymentStatus)}</small>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-outline-primary btn-sm mb-2" onclick="viewBookingDetails(${booking.id})">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        ${getActionButton(booking)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'confirmed': 'info',
        'in-progress': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return texts[status] || status;
}

// Get payment status text
function getPaymentStatusText(status) {
    const texts = {
        'paid': 'Paid',
        'pending': 'Pending',
        'failed': 'Failed'
    };
    return texts[status] || status;
}

// Get action button based on booking status
function getActionButton(booking) {
    switch (booking.status) {
        case 'pending':
            return `
                <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking(${booking.id})">
                    <i class="fas fa-times me-1"></i>Cancel
                </button>
            `;
        case 'confirmed':
            return `
                <button class="btn btn-outline-success btn-sm" onclick="contactProvider(${booking.id})">
                    <i class="fas fa-phone me-1"></i>Contact
                </button>
            `;
        case 'in-progress':
            return `
                <button class="btn btn-outline-info btn-sm" onclick="trackService(${booking.id})">
                    <i class="fas fa-map-marker-alt me-1"></i>Track
                </button>
            `;
        case 'completed':
            return `
                <button class="btn btn-outline-warning btn-sm" onclick="rateService(${booking.id})">
                    <i class="fas fa-star me-1"></i>Rate
                </button>
            `;
        default:
            return '';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Filter bookings
function filterBookings() {
    const statusFilter = document.getElementById('statusFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchQuery = document.getElementById('searchBookings').value.toLowerCase();
    
    filteredBookings = allBookings.filter(booking => {
        // Status filter
        if (statusFilter && booking.status !== statusFilter) return false;
        
        // Service filter
        if (serviceFilter && !booking.serviceType.toLowerCase().includes(serviceFilter)) return false;
        
        // Date filter
        if (dateFilter && booking.date !== dateFilter) return false;
        
        // Search query
        if (searchQuery) {
            const searchText = `${booking.serviceType} ${booking.providerName} ${booking.petName} ${booking.location}`.toLowerCase();
            if (!searchText.includes(searchQuery)) return false;
        }
        
        return true;
    });
    
    displayBookings();
}

// Sort bookings
function sortBookings(criteria) {
    switch (criteria) {
        case 'date':
            filteredBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'price':
            filteredBookings.sort((a, b) => a.price - b.price);
            break;
        case 'status':
            const statusOrder = { 'pending': 1, 'confirmed': 2, 'in-progress': 3, 'completed': 4, 'cancelled': 5 };
            filteredBookings.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            break;
    }
    
    displayBookings();
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    currentBookingId = bookingId;
    
    const modal = new bootstrap.Modal(document.getElementById('bookingDetailsModal'));
    const content = document.getElementById('bookingDetailsContent');
    const actionButton = document.getElementById('actionButton');
    
    content.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center">
                <img src="${booking.providerImage}" alt="${booking.providerName}" 
                     class="rounded-circle mb-3" style="width: 100px; height: 100px; object-fit: cover;">
                <h6>${booking.providerName}</h6>
                <p class="text-muted">Service Provider</p>
            </div>
            <div class="col-md-8">
                <h6 class="fw-bold">Service Details</h6>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Service Type:</strong><br>
                        <span class="text-muted">${booking.serviceType}</span>
                    </div>
                    <div class="col-6">
                        <strong>Pet:</strong><br>
                        <span class="text-muted">${booking.petName} (${booking.petType})</span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Date & Time:</strong><br>
                        <span class="text-muted">${formatDate(booking.date)} at ${booking.time}</span>
                    </div>
                    <div class="col-6">
                        <strong>Duration:</strong><br>
                        <span class="text-muted">${booking.duration}</span>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Location:</strong><br>
                        <span class="text-muted">${booking.location}</span>
                    </div>
                    <div class="col-6">
                        <strong>Price:</strong><br>
                        <span class="text-primary fw-bold">৳${booking.price}</span>
                    </div>
                </div>
                <div class="mb-3">
                    <strong>Description:</strong><br>
                    <span class="text-muted">${booking.description}</span>
                </div>
                ${booking.notes ? `
                    <div class="mb-3">
                        <strong>Special Notes:</strong><br>
                        <span class="text-muted">${booking.notes}</span>
                    </div>
                ` : ''}
                <div class="row">
                    <div class="col-6">
                        <strong>Provider Contact:</strong><br>
                        <span class="text-muted">${booking.providerPhone}</span><br>
                        <span class="text-muted">${booking.providerEmail}</span>
                    </div>
                    <div class="col-6">
                        <strong>Booking Date:</strong><br>
                        <span class="text-muted">${formatDate(booking.bookingDate)}</span><br>
                        <span class="badge bg-${getStatusColor(booking.status)}">${getStatusText(booking.status)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Set action button based on status
    switch (booking.status) {
        case 'pending':
            actionButton.textContent = 'Cancel Booking';
            actionButton.className = 'btn btn-danger';
            actionButton.onclick = () => cancelBooking(bookingId);
            break;
        case 'confirmed':
            actionButton.textContent = 'Contact Provider';
            actionButton.className = 'btn btn-primary';
            actionButton.onclick = () => contactProvider(bookingId);
            break;
        case 'in-progress':
            actionButton.textContent = 'Track Service';
            actionButton.className = 'btn btn-info';
            actionButton.onclick = () => trackService(bookingId);
            break;
        case 'completed':
            actionButton.textContent = 'Rate Service';
            actionButton.className = 'btn btn-warning';
            actionButton.onclick = () => rateService(bookingId);
            break;
        default:
            actionButton.style.display = 'none';
    }
    
    modal.show();
}

// Cancel booking
function cancelBooking(bookingId) {
    currentBookingId = bookingId;
    const modal = new bootstrap.Modal(document.getElementById('cancelBookingModal'));
    modal.show();
}

// Confirm cancel booking
function confirmCancelBooking() {
    if (!currentBookingId) return;
    
    const reason = document.getElementById('cancellationReason').value;
    
    // Update booking status
    const booking = allBookings.find(b => b.id === currentBookingId);
    if (booking) {
        booking.status = 'cancelled';
        // In real app, this would send to API
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('cancelBookingModal'));
    modal.hide();
    
    // Refresh display
    filteredBookings = [...allBookings];
    displayBookings();
    updateBookingStats();
    
    showNotification('Booking cancelled successfully', 'success');
    currentBookingId = null;
}

// Contact provider
function contactProvider(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Close details modal
    const detailsModal = bootstrap.Modal.getInstance(document.getElementById('bookingDetailsModal'));
    detailsModal.hide();
    
    // Show contact options
    const contactOptions = `
        Phone: ${booking.providerPhone}\n
        Email: ${booking.providerEmail}\n
        Location: ${booking.location}
    `;
    
    if (confirm(`Contact ${booking.providerName}:\n\n${contactOptions}\n\nWould you like to call now?`)) {
        window.location.href = `tel:${booking.providerPhone}`;
    }
}

// Track service
function trackService(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Close details modal
    const detailsModal = bootstrap.Modal.getInstance(document.getElementById('bookingDetailsModal'));
    detailsModal.hide();
    
    showNotification(`Tracking service for ${booking.petName}...`, 'info');
    // In real app, this would open a tracking interface
}

// Rate service
function rateService(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Close details modal
    const detailsModal = bootstrap.Modal.getInstance(document.getElementById('bookingDetailsModal'));
    detailsModal.hide();
    
    const rating = prompt(`Rate your experience with ${booking.providerName} (1-5 stars):`);
    if (rating && rating >= 1 && rating <= 5) {
        showNotification(`Thank you for your ${rating}-star rating!`, 'success');
        // In real app, this would send rating to API
    }
}

// Book new service
function bookNewService() {
    window.location.href = 'services.html';
}

// Update booking statistics
function updateBookingStats() {
    const totalBookings = document.getElementById('totalBookings');
    const completedBookings = document.getElementById('completedBookings');
    const pendingBookings = document.getElementById('pendingBookings');
    const totalSpent = document.getElementById('totalSpent');
    
    if (totalBookings) totalBookings.textContent = allBookings.length;
    if (completedBookings) completedBookings.textContent = allBookings.filter(b => b.status === 'completed').length;
    if (pendingBookings) pendingBookings.textContent = allBookings.filter(b => b.status === 'pending').length;
    if (totalSpent) {
        const total = allBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.price, 0);
        totalSpent.textContent = `৳${total.toLocaleString()}`;
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
