// Provider Earnings JavaScript
let currentUser = null;
let allTransactions = [];
let filteredTransactions = [];
let currentTimePeriod = 30;
let earningsData = {};

// Initialize the provider earnings page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadEarningsData();
    loadTransactions();
    setupLocationServices();
    setupDateRange();
    updateEarningsStats();
    displayServicePerformance();
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

// Load earnings data
function loadEarningsData() {
    // Mock earnings data - in real app, this would come from API
    earningsData = {
        total: 45000,
        thisMonth: 8500,
        thisWeek: 2200,
        pending: 1500,
        byService: {
            'dog-walking': 18000,
            'pet-sitting': 15000,
            'grooming': 8000,
            'veterinary': 4000
        },
        byMonth: {
            'Jan': 8500,
            'Feb': 7800,
            'Mar': 9200,
            'Apr': 8800,
            'May': 9500,
            'Jun': 1200
        },
        byWeek: {
            'Week 1': 2200,
            'Week 2': 1800,
            'Week 3': 2100,
            'Week 4': 2400
        }
    };
}

// Load transactions
function loadTransactions() {
    // Mock transaction data - in real app, this would come from API
    allTransactions = [
        {
            id: 1,
            serviceName: 'Professional Dog Walking',
            customerName: 'Ahmed Rahman',
            amount: 500,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-15',
            time: '09:00',
            serviceType: 'dog-walking',
            commission: 50,
            netAmount: 450
        },
        {
            id: 2,
            serviceName: 'Pet Sitting & Care',
            customerName: 'Fatima Khan',
            amount: 800,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-16',
            time: '14:00',
            serviceType: 'pet-sitting',
            commission: 80,
            netAmount: 720
        },
        {
            id: 3,
            serviceName: 'Pet Grooming Service',
            customerName: 'Rahim Ali',
            amount: 1200,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-14',
            time: '11:00',
            serviceType: 'grooming',
            commission: 120,
            netAmount: 1080
        },
        {
            id: 4,
            serviceName: 'Professional Dog Walking',
            customerName: 'Sara Ahmed',
            amount: 500,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-13',
            time: '16:00',
            serviceType: 'dog-walking',
            commission: 50,
            netAmount: 450
        },
        {
            id: 5,
            serviceName: 'Pet Sitting & Care',
            customerName: 'Imran Hossain',
            amount: 600,
            status: 'cancelled',
            paymentStatus: 'refunded',
            date: '2024-01-17',
            time: '10:00',
            serviceType: 'pet-sitting',
            commission: 0,
            netAmount: 0
        },
        {
            id: 6,
            serviceName: 'Pet Training Session',
            customerName: 'Nadia Islam',
            amount: 1500,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-12',
            time: '15:00',
            serviceType: 'training',
            commission: 150,
            netAmount: 1350
        },
        {
            id: 7,
            serviceName: 'Emergency Veterinary Care',
            customerName: 'Karim Hassan',
            amount: 2500,
            status: 'completed',
            paymentStatus: 'paid',
            date: '2024-01-11',
            time: '20:00',
            serviceType: 'veterinary',
            commission: 250,
            netAmount: 2250
        },
        {
            id: 8,
            serviceName: 'Pet Boarding Service',
            customerName: 'Layla Rahman',
            amount: 2000,
            status: 'in-progress',
            paymentStatus: 'pending',
            date: '2024-01-18',
            time: '08:00',
            serviceType: 'boarding',
            commission: 200,
            netAmount: 1800
        }
    ];

    filteredTransactions = [...allTransactions];
    displayTransactions();
}

// Display transactions
function displayTransactions() {
    const container = document.getElementById('transactionsContainer');
    
    if (filteredTransactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No transactions found</h5>
                <p class="text-muted">Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTransactions.map(transaction => createTransactionCard(transaction)).join('');
}

// Create transaction card
function createTransactionCard(transaction) {
    const statusColor = getStatusColor(transaction.status);
    const statusText = getStatusText(transaction.status);
    const paymentStatusColor = getPaymentStatusColor(transaction.paymentStatus);
    const paymentStatusText = getPaymentStatusText(transaction.paymentStatus);
    
    return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <div class="text-center">
                            <div class="mb-2">
                                <span class="badge ${statusColor} fs-6">${statusText}</span>
                            </div>
                            <div class="text-muted small">
                                <i class="fas fa-calendar me-1"></i>${formatDate(transaction.date)}
                            </div>
                            <div class="text-muted small">
                                <i class="fas fa-clock me-1"></i>${transaction.time}
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <h6 class="mb-1">${transaction.serviceName}</h6>
                        <p class="mb-1 text-muted">
                            <i class="fas fa-user me-1"></i>${transaction.customerName}
                        </p>
                        <p class="mb-0 text-muted">
                            <i class="fas fa-tag me-1"></i>${getServiceTypeText(transaction.serviceType)}
                        </p>
                    </div>
                    <div class="col-md-2">
                        <div class="text-center">
                            <h5 class="text-primary mb-1">৳${transaction.amount}</h5>
                            <p class="mb-1 text-muted small">Commission: ৳${transaction.commission}</p>
                            <p class="mb-0 text-success small"><strong>Net: ৳${transaction.netAmount}</strong></p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-center">
                            <span class="badge ${paymentStatusColor} fs-6 mb-2">${paymentStatusText}</span>
                            <div class="text-muted small">
                                <p class="mb-0">Service ID: #${transaction.id}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="d-grid">
                            <button class="btn btn-outline-primary btn-sm" onclick="viewTransactionDetails(${transaction.id})">
                                <i class="fas fa-eye me-1"></i>View Details
                            </button>
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
        'completed': 'bg-success',
        'in-progress': 'bg-primary',
        'cancelled': 'bg-danger',
        'pending': 'bg-warning'
    };
    return colors[status] || 'bg-secondary';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'cancelled': 'Cancelled',
        'pending': 'Pending'
    };
    return texts[status] || 'Unknown';
}

// Get payment status color
function getPaymentStatusColor(paymentStatus) {
    const colors = {
        'paid': 'bg-success',
        'pending': 'bg-warning',
        'refunded': 'bg-info',
        'failed': 'bg-danger'
    };
    return colors[paymentStatus] || 'bg-secondary';
}

// Get payment status text
function getPaymentStatusText(paymentStatus) {
    const texts = {
        'paid': 'Paid',
        'pending': 'Pending',
        'refunded': 'Refunded',
        'failed': 'Failed'
    };
    return texts[paymentStatus] || 'Unknown';
}

// Get service type text
function getServiceTypeText(serviceType) {
    const texts = {
        'dog-walking': 'Dog Walking',
        'pet-sitting': 'Pet Sitting',
        'grooming': 'Grooming',
        'veterinary': 'Veterinary Care',
        'training': 'Training',
        'boarding': 'Boarding'
    };
    return texts[serviceType] || 'Other';
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

// Sort transactions
function sortTransactions(criteria) {
    filteredTransactions.sort((a, b) => {
        switch (criteria) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'amount':
                return b.amount - a.amount;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });
    
    displayTransactions();
}

// View transaction details
function viewTransactionDetails(transactionId) {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const modal = document.getElementById('transactionDetailsModal');
    const content = document.getElementById('transactionDetailsContent');

    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-primary">Transaction Information</h6>
                <p><strong>Transaction ID:</strong> #${transaction.id}</p>
                <p><strong>Service:</strong> ${transaction.serviceName}</p>
                <p><strong>Date:</strong> ${formatDate(transaction.date)}</p>
                <p><strong>Time:</strong> ${transaction.time}</p>
                <p><strong>Service Type:</strong> ${getServiceTypeText(transaction.serviceType)}</p>
                <p><strong>Status:</strong> 
                    <span class="badge ${getStatusColor(transaction.status)}">${getStatusText(transaction.status)}</span>
                </p>
            </div>
            <div class="col-md-6">
                <h6 class="text-primary">Financial Details</h6>
                <p><strong>Total Amount:</strong> ৳${transaction.amount}</p>
                <p><strong>Commission:</strong> ৳${transaction.commission}</p>
                <p><strong>Net Amount:</strong> ৳${transaction.netAmount}</p>
                <p><strong>Payment Status:</strong> 
                    <span class="badge ${getPaymentStatusColor(transaction.paymentStatus)}">${getPaymentStatusText(transaction.paymentStatus)}</span>
                </p>
                
                <h6 class="text-primary mt-3">Customer Information</h6>
                <p><strong>Name:</strong> ${transaction.customerName}</p>
            </div>
        </div>
    `;

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Setup date range
function setupDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - currentTimePeriod);
    
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
}

// Change time period
function changeTimePeriod() {
    currentTimePeriod = parseInt(document.getElementById('timePeriod').value);
    setupDateRange();
    updateEarningsStats();
}

// Update date range
function updateDateRange() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (startDate && endDate && startDate <= endDate) {
        updateEarningsStats();
    }
}

// Update earnings statistics
function updateEarningsStats() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) return;
    
    // Filter transactions by date range
    const filteredByDate = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end && transaction.status === 'completed';
    });
    
    // Calculate earnings for the period
    const periodEarnings = filteredByDate.reduce((sum, transaction) => sum + transaction.netAmount, 0);
    
    // Update display
    document.getElementById('totalEarnings').textContent = `৳${earningsData.total.toLocaleString()}`;
    document.getElementById('thisMonthEarnings').textContent = `৳${earningsData.thisMonth.toLocaleString()}`;
    document.getElementById('thisWeekEarnings').textContent = `৳${earningsData.thisWeek.toLocaleString()}`;
    document.getElementById('pendingEarnings').textContent = `৳${earningsData.pending.toLocaleString()}`;
}

// Display service performance
function displayServicePerformance() {
    const container = document.getElementById('servicePerformanceContainer');
    
    const serviceData = earningsData.byService;
    const services = Object.keys(serviceData);
    
    if (services.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No service data available</h5>
                <p class="text-muted">Start offering services to see performance data.</p>
            </div>
        `;
        return;
    }

    const totalEarnings = Object.values(serviceData).reduce((sum, amount) => sum + amount, 0);
    
    container.innerHTML = services.map(service => {
        const amount = serviceData[service];
        const percentage = ((amount / totalEarnings) * 100).toFixed(1);
        const serviceText = getServiceTypeText(service);
        
        return `
            <div class="row mb-3 align-items-center">
                <div class="col-md-3">
                    <h6 class="mb-0">${serviceText}</h6>
                </div>
                <div class="col-md-6">
                    <div class="progress" style="height: 25px;">
                        <div class="progress-bar bg-primary" role="progressbar" 
                             style="width: ${percentage}%" 
                             aria-valuenow="${percentage}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            ${percentage}%
                        </div>
                    </div>
                </div>
                <div class="col-md-3 text-end">
                    <h6 class="text-primary mb-0">৳${amount.toLocaleString()}</h6>
                </div>
            </div>
        `;
    }).join('');
}

// Refresh earnings
function refreshEarnings() {
    loadEarningsData();
    loadTransactions();
    updateEarningsStats();
    displayServicePerformance();
    showNotification('Earnings data refreshed successfully', 'success');
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
