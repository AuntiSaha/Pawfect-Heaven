// Provider Bookings JavaScript
let currentUser = null;
let allBookings = [];
let filteredBookings = [];
let currentEditingBooking = null;

// Initialize the provider bookings page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadBookings();
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

// Load bookings
function loadBookings() {
    // Mock data - in real app, this would come from API
    allBookings = [
        {
            id: 1,
            serviceName: 'Professional Dog Walking',
            customerName: 'Ahmed Rahman',
            customerPhone: '+880 1712-345678',
            customerEmail: 'ahmed@email.com',
            petName: 'Max',
            petType: 'Dog',
            petBreed: 'Golden Retriever',
            petAge: '3 years',
            serviceDate: '2024-01-15',
            serviceTime: '09:00',
            duration: '1 hour',
            location: 'Gulshan, Dhaka',
            amount: 500,
            status: 'pending',
            paymentStatus: 'pending',
            specialRequirements: 'Max is friendly but needs to be on leash',
            notes: 'Customer requested morning walk',
            createdAt: '2024-01-10T10:30:00Z'
        },
        {
            id: 2,
            serviceName: 'Pet Sitting & Care',
            customerName: 'Fatima Khan',
            customerPhone: '+880 1812-345679',
            customerEmail: 'fatima@email.com',
            petName: 'Luna',
            petType: 'Cat',
            petBreed: 'Persian',
            petAge: '2 years',
            serviceDate: '2024-01-16',
            serviceTime: '14:00',
            duration: '8 hours',
            location: 'Dhanmondi, Dhaka',
            amount: 800,
            status: 'confirmed',
            paymentStatus: 'paid',
            specialRequirements: 'Luna is shy, needs gentle approach',
            notes: 'Customer will be away for work',
            createdAt: '2024-01-11T15:45:00Z'
        },
        {
            id: 3,
            serviceName: 'Pet Grooming Service',
            customerName: 'Rahim Ali',
            customerPhone: '+880 1912-345680',
            customerEmail: 'rahim@email.com',
            petName: 'Rocky',
            petType: 'Dog',
            petBreed: 'German Shepherd',
            petAge: '4 years',
            serviceDate: '2024-01-14',
            serviceTime: '11:00',
            duration: '3 hours',
            location: 'Banani, Dhaka',
            amount: 1200,
            status: 'in-progress',
            paymentStatus: 'paid',
            specialRequirements: 'Rocky needs extra attention during bath',
            notes: 'Customer requested full grooming package',
            createdAt: '2024-01-12T09:15:00Z'
        },
        {
            id: 4,
            serviceName: 'Professional Dog Walking',
            customerName: 'Sara Ahmed',
            customerPhone: '+880 1612-345681',
            customerEmail: 'sara@email.com',
            petName: 'Buddy',
            petType: 'Dog',
            petBreed: 'Labrador',
            petAge: '2 years',
            serviceDate: '2024-01-13',
            serviceTime: '16:00',
            duration: '1 hour',
            location: 'Gulshan, Dhaka',
            amount: 500,
            status: 'completed',
            paymentStatus: 'paid',
            specialRequirements: 'Buddy loves to play fetch',
            notes: 'Service completed successfully',
            createdAt: '2024-01-09T14:20:00Z'
        },
        {
            id: 5,
            serviceName: 'Pet Sitting & Care',
            customerName: 'Imran Hossain',
            customerPhone: '+880 1512-345682',
            customerEmail: 'imran@email.com',
            petName: 'Milo',
            petType: 'Cat',
            petBreed: 'Maine Coon',
            petAge: '1 year',
            serviceDate: '2024-01-17',
            serviceTime: '10:00',
            duration: '6 hours',
            location: 'Dhanmondi, Dhaka',
            amount: 600,
            status: 'cancelled',
            paymentStatus: 'refunded',
            specialRequirements: 'Milo is very active and playful',
            notes: 'Customer cancelled due to change of plans',
            createdAt: '2024-01-13T11:30:00Z'
        }
    ];

    filteredBookings = [...allBookings];
    displayBookings();
}

// Display bookings
function displayBookings() {
    const container = document.getElementById('bookingsContainer');
    
    if (filteredBookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No bookings found</h5>
                <p class="text-muted">Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredBookings.map(booking => createBookingCard(booking)).join('');
}

// Create booking card
function createBookingCard(booking) {
    const statusColor = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);
    const paymentStatusText = getPaymentStatusText(booking.paymentStatus);
    const actionButton = getActionButton(booking);
    
    return `
        <div class="card booking-card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="mb-2">
                                <span class="badge ${statusColor} fs-6">${statusText}</span>
                            </div>
                            <div class="text-muted small">
                                <i class="fas fa-calendar me-1"></i>${formatDate(booking.serviceDate)}
                            </div>
                            <div class="text-muted small">
                                <i class="fas fa-clock me-1"></i>${booking.serviceTime}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <h6 class="mb-1">${booking.serviceName}</h6>
                        <p class="mb-1 text-muted">
                            <i class="fas fa-user me-1"></i>${booking.customerName}
                        </p>
                        <p class="mb-1 text-muted">
                            <i class="fas fa-paw me-1"></i>${booking.petName} (${booking.petBreed})
                        </p>
                        <p class="mb-0 text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>${booking.location}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <h5 class="text-primary mb-1">৳${booking.amount}</h5>
                            <p class="mb-1 text-muted small">${booking.duration}</p>
                            <span class="badge ${booking.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}">
                                ${paymentStatusText}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-muted small">
                            <p class="mb-1"><strong>Pet Details:</strong></p>
                            <p class="mb-1">${booking.petType}, ${booking.petAge}</p>
                            <p class="mb-0"><strong>Requirements:</strong> ${booking.specialRequirements}</p>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary btn-sm" onclick="viewBookingDetails(${booking.id})">
                                <i class="fas fa-eye me-1"></i>View Details
                            </button>
                            ${actionButton}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': 'bg-warning',
        'confirmed': 'bg-info',
        'in-progress': 'bg-primary',
        'completed': 'bg-success',
        'cancelled': 'bg-danger'
    };
    return colors[status] || 'bg-secondary';
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
    return texts[status] || 'Unknown';
}

// Get payment status text
function getPaymentStatusText(paymentStatus) {
    const texts = {
        'pending': 'Pending',
        'paid': 'Paid',
        'refunded': 'Refunded',
        'failed': 'Failed'
    };
    return texts[paymentStatus] || 'Unknown';
}

// Get action button based on status
function getActionButton(booking) {
    switch (booking.status) {
        case 'pending':
            return `
                <button class="btn btn-success btn-sm" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                    <i class="fas fa-check me-1"></i>Confirm
                </button>
                <button class="btn btn-danger btn-sm" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                    <i class="fas fa-times me-1"></i>Decline
                </button>
            `;
        case 'confirmed':
            return `
                <button class="btn btn-primary btn-sm" onclick="updateBookingStatus(${booking.id}, 'in-progress')">
                    <i class="fas fa-play me-1"></i>Start
                </button>
            `;
        case 'in-progress':
            return `
                <button class="btn btn-success btn-sm" onclick="updateBookingStatus(${booking.id}, 'completed')">
                    <i class="fas fa-check me-1"></i>Complete
                </button>
            `;
        case 'completed':
            return `
                <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="fas fa-check me-1"></i>Completed
                </button>
            `;
        case 'cancelled':
            return `
                <button class="btn btn-outline-secondary btn-sm" disabled>
                    <i class="fas fa-ban me-1"></i>Cancelled
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

    filteredBookings = allBookings.filter(booking => {
        const statusMatch = !statusFilter || booking.status === statusFilter;
        const serviceMatch = !serviceFilter || booking.serviceName.toLowerCase().includes(serviceFilter.toLowerCase());
        const dateMatch = !dateFilter || booking.serviceDate === dateFilter;
        
        return statusMatch && serviceMatch && dateMatch;
    });

    displayBookings();
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('serviceFilter').value = '';
    document.getElementById('dateFilter').value = '';
    
    filteredBookings = [...allBookings];
    displayBookings();
}

// Sort bookings
function sortBookings(criteria) {
    filteredBookings.sort((a, b) => {
        switch (criteria) {
            case 'date':
                return new Date(a.serviceDate) - new Date(b.serviceDate);
            case 'amount':
                return b.amount - a.amount;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });
    
    displayBookings();
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('bookingDetailsModal');
    const content = document.getElementById('bookingDetailsContent');
    const actionBtn = document.getElementById('actionButton');

    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary">Service Information</h6>
                <p><strong>Service:</strong> ${booking.serviceName}</p>
                <p><strong>Date:</strong> ${formatDate(booking.serviceDate)}</p>
                <p><strong>Time:</strong> ${booking.serviceTime}</p>
                <p><strong>Duration:</strong> ${booking.duration}</p>
                <p><strong>Location:</strong> ${booking.location}</p>
                <p><strong>Amount:</strong> ৳${booking.amount}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary">Customer Information</h6>
                <p><strong>Name:</strong> ${booking.customerName}</p>
                <p><strong>Phone:</strong> ${booking.customerPhone}</p>
                <p><strong>Email:</strong> ${booking.customerEmail}</p>
                
                <h6 class="text-primary mt-3">Pet Information</h6>
                <p><strong>Name:</strong> ${booking.petName}</p>
                <p><strong>Type:</strong> ${booking.petType}</p>
                <p><strong>Breed:</strong> ${booking.petBreed}</p>
                <p><strong>Age:</strong> ${booking.petAge}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6 class="text-primary">Special Requirements</h6>
                <p>${booking.specialRequirements}</p>
                
                <h6 class="text-primary">Notes</h6>
                <p>${booking.notes || 'No additional notes'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <h6 class="text-primary">Current Status</h6>
                <span class="badge ${getStatusColor(booking.status)} fs-6">${getStatusText(booking.status)}</span>
                <span class="badge ${booking.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'} ms-2">
                    ${getPaymentStatusText(booking.paymentStatus)}
                </span>
            </div>
        </div>
    `;

    // Set action button based on status
    if (booking.status === 'pending') {
        actionBtn.innerHTML = '<i class="fas fa-edit me-1"></i>Update Status';
        actionBtn.onclick = () => {
            modal.hide();
            updateBookingStatus(booking.id);
        };
    } else if (['confirmed', 'in-progress'].includes(booking.status)) {
        actionBtn.innerHTML = '<i class="fas fa-edit me-1"></i>Update Status';
        actionBtn.onclick = () => {
            modal.hide();
            updateBookingStatus(booking.id);
        };
    } else {
        actionBtn.innerHTML = '<i class="fas fa-times me-1"></i>Close';
        actionBtn.onclick = () => modal.hide();
    }

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Update booking status
function updateBookingStatus(bookingId, newStatus = null) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (newStatus) {
        // Direct status update
        handleStatusUpdateDirect(bookingId, newStatus);
    } else {
        // Show status update modal
        document.getElementById('updateBookingId').value = bookingId;
        document.getElementById('newStatus').value = '';
        document.getElementById('statusNotes').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
        modal.show();
    }
}

// Handle status update from modal
function handleStatusUpdate() {
    const bookingId = document.getElementById('updateBookingId').value;
    const newStatus = document.getElementById('newStatus').value;
    const notes = document.getElementById('statusNotes').value;

    if (!newStatus) {
        showNotification('Please select a new status', 'error');
        return;
    }

    handleStatusUpdateDirect(bookingId, newStatus, notes);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('updateStatusModal'));
    modal.hide();
}

// Handle direct status update
function handleStatusUpdateDirect(bookingId, newStatus, notes = '') {
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) return;

    const oldStatus = allBookings[bookingIndex].status;
    allBookings[bookingIndex].status = newStatus;
    
    // Add notes if provided
    if (notes) {
        allBookings[bookingIndex].notes = (allBookings[bookingIndex].notes || '') + 
            `\n[${new Date().toLocaleString()}] Status changed from ${oldStatus} to ${newStatus}: ${notes}`;
    }

    // Update filtered bookings
    const filteredIndex = filteredBookings.findIndex(b => b.id === bookingId);
    if (filteredIndex !== -1) {
        filteredBookings[filteredIndex] = allBookings[bookingIndex];
    }

    // Update display and stats
    displayBookings();
    updateBookingStats();
    
    showNotification(`Booking status updated to ${getStatusText(newStatus)}`, 'success');
}

// Refresh bookings
function refreshBookings() {
    loadBookings();
    showNotification('Bookings refreshed successfully', 'success');
}

// Update booking statistics
function updateBookingStats() {
    const total = allBookings.length;
    const pending = allBookings.filter(b => b.status === 'pending').length;
    const inProgress = allBookings.filter(b => b.status === 'in-progress').length;
    const completed = allBookings.filter(b => b.status === 'completed').length;

    document.getElementById('totalBookings').textContent = total;
    document.getElementById('pendingBookings').textContent = pending;
    document.getElementById('inProgressBookings').textContent = inProgress;
    document.getElementById('completedBookings').textContent = completed;
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
