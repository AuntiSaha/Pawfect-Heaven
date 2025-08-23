// Admin Dashboard JavaScript for PawFect

// Global variables
let adminData = {
    users: [],
    providers: [],
    bookings: [],
    settings: {},
    statistics: {}
};

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    try {
        // Show loading overlay
        showLoadingOverlay();
        
        // Check admin authentication
        checkAdminAuth();
        
        // Load initial data
        loadDashboardData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize charts
        initializeCharts();
        
        // Load mock data
        loadMockData();
        
        // Hide loading overlay
        hideLoadingOverlay();
        
        // Show welcome notification
        showNotification('Welcome to PawFect Admin Dashboard!', 'success');
        
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        hideLoadingOverlay();
        showNotification('Error initializing dashboard. Please refresh the page.', 'danger');
    }
}

// Loading overlay functions
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('petcare_token') || sessionStorage.getItem('petcare_token');
    const user = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = JSON.parse(user);
    if (currentUser.type !== 'admin') {
        // Redirect non-admin users
        if (currentUser.type === 'provider') {
            window.location.href = 'provider-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
        return;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load statistics
    loadStatistics();
    
    // Load users
    loadUsers();
    
    // Load providers
    loadProviders();
    
    // Load bookings
    loadBookings();
    
    // Load settings
    loadSettings();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality with debouncing
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        let userSearchTimeout;
        userSearch.addEventListener('input', function() {
            clearTimeout(userSearchTimeout);
            userSearchTimeout = setTimeout(() => {
                filterUsers(this.value);
            }, 300);
        });
    }
    
    const providerSearch = document.getElementById('providerSearch');
    if (providerSearch) {
        let providerSearchTimeout;
        providerSearch.addEventListener('input', function() {
            clearTimeout(providerSearchTimeout);
            providerSearchTimeout = setTimeout(() => {
                filterProviders(this.value);
            }, 300);
        });
    }
    
    const bookingSearch = document.getElementById('bookingSearch');
    if (bookingSearch) {
        let bookingSearchTimeout;
        bookingSearch.addEventListener('input', function() {
            clearTimeout(bookingSearchTimeout);
            bookingSearchTimeout = setTimeout(() => {
                filterBookings(this.value);
            }, 300);
        });
    }
    
    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.navbar-toggler');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('show');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.querySelector('.navbar-toggler');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
    
    // Settings forms
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }
    
    const securitySettingsForm = document.getElementById('securitySettingsForm');
    if (securitySettingsForm) {
        securitySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSecuritySettings();
        });
    }
    
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNotificationSettings();
        });
    }
}

// Show different sections
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(sectionName);
}

// Update navigation active state
function updateNavigation(activeSection) {
    // Update sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${activeSection}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update navbar links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeNavLink = document.querySelector(`.navbar-nav .nav-link[onclick="showSection('${activeSection}')"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
}

// Load mock data
function loadMockData() {
    // Mock users data
    adminData.users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+880 1712345678',
            location: 'Dhaka, Bangladesh',
            status: 'Active',
            joined: '2024-01-15'
        },
        {
            id: 2,
            name: 'Sarah Ahmed',
            email: 'sarah.ahmed@example.com',
            phone: '+880 1812345678',
            location: 'Chittagong, Bangladesh',
            status: 'Active',
            joined: '2024-01-20'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+880 1912345678',
            location: 'Sylhet, Bangladesh',
            status: 'Inactive',
            joined: '2024-02-01'
        }
    ];
    
    // Mock providers data
    adminData.providers = [
        {
            id: 1,
            name: 'Dr. Emily Chen',
            email: 'emily.chen@example.com',
            services: 'Veterinary Care, Grooming',
            rating: 4.8,
            status: 'Active',
            verification: 'Verified'
        },
        {
            id: 2,
            name: 'Pet Care Plus',
            email: 'info@petcareplus.com',
            services: 'Pet Sitting, Dog Walking',
            rating: 4.5,
            status: 'Active',
            verification: 'Pending'
        },
        {
            id: 3,
            name: 'Happy Paws Grooming',
            email: 'contact@happypaws.com',
            services: 'Grooming, Training',
            rating: 4.7,
            status: 'Active',
            verification: 'Verified'
        }
    ];
    
    // Mock bookings data
    adminData.bookings = [
        {
            id: 'BK001',
            user: 'John Doe',
            provider: 'Dr. Emily Chen',
            service: 'Veterinary Checkup',
            date: '2024-03-15',
            amount: '$50',
            status: 'Completed'
        },
        {
            id: 'BK002',
            user: 'Sarah Ahmed',
            provider: 'Pet Care Plus',
            service: 'Dog Walking',
            date: '2024-03-16',
            amount: '$25',
            status: 'Confirmed'
        },
        {
            id: 'BK003',
            user: 'Mike Johnson',
            provider: 'Happy Paws Grooming',
            service: 'Pet Grooming',
            date: '2024-03-17',
            amount: '$40',
            status: 'Pending'
        }
    ];
    
    // Update displays
    updateUsersTable();
    updateProvidersTable();
    updateBookingsTable();
    updateStatistics();
    updateRecentActivity();
}

// Load statistics
function loadStatistics() {
    adminData.statistics = {
        totalUsers: adminData.users.length,
        totalProviders: adminData.providers.length,
        totalBookings: adminData.bookings.length,
        totalRevenue: '$2,500'
    };
}

// Update statistics display
function updateStatistics() {
    document.getElementById('totalUsers').textContent = adminData.statistics.totalUsers;
    document.getElementById('totalProviders').textContent = adminData.statistics.totalProviders;
    document.getElementById('totalBookings').textContent = adminData.statistics.totalBookings;
    document.getElementById('totalRevenue').textContent = adminData.statistics.totalRevenue;
}

// Update recent activity
function updateRecentActivity() {
    const tbody = document.querySelector('#recentActivityTable tbody');
    if (!tbody) return;
    
    const activities = [
        {
            time: '2 minutes ago',
            activity: 'New user registration',
            user: 'john.doe@example.com',
            status: 'Completed'
        },
        {
            time: '5 minutes ago',
            activity: 'Provider verification',
            user: 'emily.chen@example.com',
            status: 'Pending'
        },
        {
            time: '10 minutes ago',
            activity: 'Booking completed',
            user: 'sarah.ahmed@example.com',
            status: 'Success'
        },
        {
            time: '15 minutes ago',
            activity: 'Payment received',
            user: 'mike.johnson@example.com',
            status: 'Completed'
        },
        {
            time: '20 minutes ago',
            activity: 'Service updated',
            user: 'petcareplus.com',
            status: 'Updated'
        }
    ];
    
    tbody.innerHTML = '';
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><small class="text-muted">${activity.time}</small></td>
            <td>${activity.activity}</td>
            <td>${activity.user}</td>
            <td><span class="badge bg-${getActivityStatusColor(activity.status)}">${activity.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Get activity status color
function getActivityStatusColor(status) {
    switch (status) {
        case 'Completed':
        case 'Success':
            return 'success';
        case 'Pending':
            return 'warning';
        case 'Updated':
            return 'info';
        default:
            return 'secondary';
    }
}

// Load users
function loadUsers() {
    // In a real application, this would fetch from API
    updateUsersTable();
}

// Update users table
function updateUsersTable() {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.location}</td>
            <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'secondary'}">${user.status}</span></td>
            <td>${user.joined}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load providers
function loadProviders() {
    updateProvidersTable();
}

// Update providers table
function updateProvidersTable() {
    const tbody = document.querySelector('#providersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.providers.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.name}</td>
            <td>${provider.email}</td>
            <td>${provider.services}</td>
            <td><span class="badge bg-success">${provider.rating} ⭐</span></td>
            <td><span class="badge bg-${provider.status === 'Active' ? 'success' : 'secondary'}">${provider.status}</span></td>
            <td><span class="badge bg-${provider.verification === 'Verified' ? 'success' : 'warning'}">${provider.verification}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewProvider(${provider.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editProvider(${provider.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="verifyProvider(${provider.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProvider(${provider.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load bookings
function loadBookings() {
    updateBookingsTable();
}

// Update bookings table
function updateBookingsTable() {
    const tbody = document.querySelector('#bookingsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.user}</td>
            <td>${booking.provider}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td>${booking.amount}</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewBooking('${booking.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editBooking('${booking.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get status color
function getStatusColor(status) {
    switch (status) {
        case 'Completed': return 'success';
        case 'Confirmed': return 'primary';
        case 'Pending': return 'warning';
        case 'Cancelled': return 'danger';
        default: return 'secondary';
    }
}

// Filter functions
function filterUsers(searchTerm) {
    const filteredUsers = adminData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    updateUsersTableWithData(filteredUsers);
}

function filterProviders(searchTerm) {
    const filteredProviders = adminData.providers.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    updateProvidersTableWithData(filteredProviders);
}

function filterBookings(searchTerm) {
    const filteredBookings = adminData.bookings.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    updateBookingsTableWithData(filteredBookings);
}

// Update tables with filtered data
function updateUsersTableWithData(users) {
    const tbody = document.querySelector('#usersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.location}</td>
            <td><span class="badge bg-${user.status === 'Active' ? 'success' : 'secondary'}">${user.status}</span></td>
            <td>${user.joined}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateProvidersTableWithData(providers) {
    const tbody = document.querySelector('#providersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    providers.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.id}</td>
            <td>${provider.name}</td>
            <td>${provider.email}</td>
            <td>${provider.services}</td>
            <td><span class="badge bg-success">${provider.rating} ⭐</span></td>
            <td><span class="badge bg-${provider.status === 'Active' ? 'success' : 'secondary'}">${provider.status}</span></td>
            <td><span class="badge bg-${provider.verification === 'Verified' ? 'success' : 'warning'}">${provider.verification}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewProvider(${provider.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editProvider(${provider.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="verifyProvider(${provider.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProvider(${provider.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateBookingsTableWithData(bookings) {
    const tbody = document.querySelector('#bookingsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.user}</td>
            <td>${booking.provider}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td>${booking.amount}</td>
            <td><span class="badge bg-${getStatusColor(booking.status)}">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewBooking('${booking.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editBooking('${booking.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize charts
function initializeCharts() {
    try {
        // Growth Chart
        const growthCtx = document.getElementById('growthChart');
        if (growthCtx) {
            new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Users',
                        data: [65, 89, 120, 150, 180, 220],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Providers',
                        data: [12, 19, 25, 35, 42, 50],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Platform Growth Trends'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    }
                }
            });
        }
        
        // User Distribution Chart
        const distributionCtx = document.getElementById('userDistributionChart');
        if (distributionCtx) {
            new Chart(distributionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pet Owners', 'Service Providers'],
                    datasets: [{
                        data: [70, 30],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 205, 86, 0.8)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 205, 86, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        title: {
                            display: true,
                            text: 'User Distribution'
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
        showNotification('Error loading charts. Please refresh the page.', 'warning');
    }
}

// Export functions
function exportUsers() {
    try {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Name,Email,Phone,Location,Status,Joined\n"
            + adminData.users.map(user => 
                `"${user.id}","${user.name}","${user.email}","${user.phone}","${user.location}","${user.status}","${user.joined}"`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Users exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting users:', error);
        showNotification('Error exporting users. Please try again.', 'danger');
    }
}

function exportProviders() {
    try {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Name,Email,Services,Rating,Status,Verification\n"
            + adminData.providers.map(provider => 
                `"${provider.id}","${provider.name}","${provider.email}","${provider.services}","${provider.rating}","${provider.status}","${provider.verification}"`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `providers_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Providers exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting providers:', error);
        showNotification('Error exporting providers. Please try again.', 'danger');
    }
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const exportFormat = document.getElementById('exportFormat').value;
    
    const reportContent = document.getElementById('reportContent');
    
    let reportHTML = `
        <div class="alert alert-info">
            <h5>Report Generated</h5>
            <p><strong>Type:</strong> ${reportType}</p>
            <p><strong>Date Range:</strong> Last ${dateRange} days</p>
            <p><strong>Format:</strong> ${exportFormat.toUpperCase()}</p>
        </div>
    `;
    
    switch (reportType) {
        case 'revenue':
            reportHTML += generateRevenueReport();
            break;
        case 'users':
            reportHTML += generateUserReport();
            break;
        case 'bookings':
            reportHTML += generateBookingReport();
            break;
        case 'providers':
            reportHTML += generateProviderReport();
            break;
    }
    
    reportContent.innerHTML = reportHTML;
    showNotification('Report generated successfully!', 'success');
}

function generateRevenueReport() {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Revenue Summary</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Revenue</span>
                        <span class="fw-bold">$2,500</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Commission Earned</span>
                        <span class="fw-bold">$250</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Average per Booking</span>
                        <span class="fw-bold">$35</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Top Services</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Veterinary Care</span>
                        <span class="fw-bold">$800</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Pet Grooming</span>
                        <span class="fw-bold">$600</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Dog Walking</span>
                        <span class="fw-bold">$400</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

function generateUserReport() {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>User Growth</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Users</span>
                        <span class="fw-bold">${adminData.users.length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Active Users</span>
                        <span class="fw-bold">${adminData.users.filter(u => u.status === 'Active').length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>New This Month</span>
                        <span class="fw-bold">15</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>User Locations</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Dhaka</span>
                        <span class="fw-bold">45%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Chittagong</span>
                        <span class="fw-bold">30%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Other Cities</span>
                        <span class="fw-bold">25%</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

function generateBookingReport() {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Booking Statistics</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Bookings</span>
                        <span class="fw-bold">${adminData.bookings.length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Completed</span>
                        <span class="fw-bold">${adminData.bookings.filter(b => b.status === 'Completed').length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Pending</span>
                        <span class="fw-bold">${adminData.bookings.filter(b => b.status === 'Pending').length}</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Popular Services</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Veterinary Care</span>
                        <span class="fw-bold">40%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Pet Grooming</span>
                        <span class="fw-bold">35%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Dog Walking</span>
                        <span class="fw-bold">25%</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

function generateProviderReport() {
    return `
        <div class="row">
            <div class="col-md-6">
                <h6>Provider Statistics</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Total Providers</span>
                        <span class="fw-bold">${adminData.providers.length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Verified</span>
                        <span class="fw-bold">${adminData.providers.filter(p => p.verification === 'Verified').length}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Average Rating</span>
                        <span class="fw-bold">4.7 ⭐</span>
                    </li>
                </ul>
            </div>
            <div class="col-md-6">
                <h6>Service Categories</h6>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Veterinary Care</span>
                        <span class="fw-bold">25%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Pet Grooming</span>
                        <span class="fw-bold">35%</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Pet Sitting</span>
                        <span class="fw-bold">40%</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

// Settings functions
function loadSettings() {
    // Load settings from localStorage or default values
    adminData.settings = JSON.parse(localStorage.getItem('adminSettings')) || {
        platformName: 'PawFect',
        supportEmail: 'support@pawfect.com',
        commissionRate: 10,
        maintenanceMode: false,
        autoApproveProviders: true,
        sessionTimeout: 30,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        enable2FA: false,
        loginAttempts: 5,
        emailNewUsers: true,
        emailNewProviders: true,
        emailBookings: true,
        systemErrors: true,
        maintenanceAlerts: true,
        securityAlerts: true
    };
    
    // Populate form fields
    populateSettingsForm();
}

function populateSettingsForm() {
    const settings = adminData.settings;
    
    // General settings
    if (document.getElementById('platformName')) {
        document.getElementById('platformName').value = settings.platformName;
        document.getElementById('supportEmail').value = settings.supportEmail;
        document.getElementById('commissionRate').value = settings.commissionRate;
        document.getElementById('maintenanceMode').checked = settings.maintenanceMode;
        document.getElementById('autoApproveProviders').checked = settings.autoApproveProviders;
    }
    
    // Security settings
    if (document.getElementById('sessionTimeout')) {
        document.getElementById('sessionTimeout').value = settings.sessionTimeout;
        document.getElementById('requireUppercase').checked = settings.requireUppercase;
        document.getElementById('requireNumbers').checked = settings.requireNumbers;
        document.getElementById('requireSpecialChars').checked = settings.requireSpecialChars;
        document.getElementById('enable2FA').checked = settings.enable2FA;
        document.getElementById('loginAttempts').value = settings.loginAttempts;
    }
    
    // Notification settings
    if (document.getElementById('emailNewUsers')) {
        document.getElementById('emailNewUsers').checked = settings.emailNewUsers;
        document.getElementById('emailNewProviders').checked = settings.emailNewProviders;
        document.getElementById('emailBookings').checked = settings.emailBookings;
        document.getElementById('systemErrors').checked = settings.systemErrors;
        document.getElementById('maintenanceAlerts').checked = settings.maintenanceAlerts;
        document.getElementById('securityAlerts').checked = settings.securityAlerts;
    }
}

function saveGeneralSettings() {
    const settings = {
        ...adminData.settings,
        platformName: document.getElementById('platformName').value,
        supportEmail: document.getElementById('supportEmail').value,
        commissionRate: parseInt(document.getElementById('commissionRate').value),
        maintenanceMode: document.getElementById('maintenanceMode').checked,
        autoApproveProviders: document.getElementById('autoApproveProviders').checked
    };
    
    adminData.settings = settings;
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('General settings saved successfully!', 'success');
}

function saveSecuritySettings() {
    const settings = {
        ...adminData.settings,
        sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
        requireUppercase: document.getElementById('requireUppercase').checked,
        requireNumbers: document.getElementById('requireNumbers').checked,
        requireSpecialChars: document.getElementById('requireSpecialChars').checked,
        enable2FA: document.getElementById('enable2FA').checked,
        loginAttempts: parseInt(document.getElementById('loginAttempts').value)
    };
    
    adminData.settings = settings;
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Security settings saved successfully!', 'success');
}

function saveNotificationSettings() {
    const settings = {
        ...adminData.settings,
        emailNewUsers: document.getElementById('emailNewUsers').checked,
        emailNewProviders: document.getElementById('emailNewProviders').checked,
        emailBookings: document.getElementById('emailBookings').checked,
        systemErrors: document.getElementById('systemErrors').checked,
        maintenanceAlerts: document.getElementById('maintenanceAlerts').checked,
        securityAlerts: document.getElementById('securityAlerts').checked
    };
    
    adminData.settings = settings;
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Notification settings saved successfully!', 'success');
}

// User management functions
function viewUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nLocation: ${user.location}`);
    }
}

function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        alert(`Editing user: ${user.name}`);
        // In a real application, this would open a modal or form
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        adminData.users = adminData.users.filter(u => u.id !== userId);
        updateUsersTable();
        updateStatistics();
        showNotification('User deleted successfully!', 'success');
    }
}

// Provider management functions
function viewProvider(providerId) {
    const provider = adminData.providers.find(p => p.id === providerId);
    if (provider) {
        alert(`Viewing provider: ${provider.name}\nEmail: ${provider.email}\nServices: ${provider.services}\nRating: ${provider.rating}`);
    }
}

function editProvider(providerId) {
    const provider = adminData.providers.find(p => p.id === providerId);
    if (provider) {
        alert(`Editing provider: ${provider.name}`);
        // In a real application, this would open a modal or form
    }
}

function verifyProvider(providerId) {
    const provider = adminData.providers.find(p => p.id === providerId);
    if (provider) {
        provider.verification = 'Verified';
        updateProvidersTable();
        showNotification('Provider verified successfully!', 'success');
    }
}

function deleteProvider(providerId) {
    if (confirm('Are you sure you want to delete this provider?')) {
        adminData.providers = adminData.providers.filter(p => p.id !== providerId);
        updateProvidersTable();
        updateStatistics();
        showNotification('Provider deleted successfully!', 'success');
    }
}

// Booking management functions
function viewBooking(bookingId) {
    const booking = adminData.bookings.find(b => b.id === bookingId);
    if (booking) {
        alert(`Viewing booking: ${booking.id}\nUser: ${booking.user}\nProvider: ${booking.provider}\nService: ${booking.service}\nDate: ${booking.date}\nAmount: ${booking.amount}`);
    }
}

function editBooking(bookingId) {
    const booking = adminData.bookings.find(b => b.id === bookingId);
    if (booking) {
        alert(`Editing booking: ${booking.id}`);
        // In a real application, this would open a modal or form
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show admin-notification`;
    
    // Add icon based on notification type
    let icon = 'info-circle';
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        case 'danger':
            icon = 'times-circle';
            break;
        case 'info':
        default:
            icon = 'info-circle';
            break;
    }
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Logout function
function logout() {
    localStorage.removeItem('petcare_token');
    localStorage.removeItem('petcare_user');
    sessionStorage.removeItem('petcare_token');
    sessionStorage.removeItem('petcare_user');
    
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Test function for debugging
function testAdminDashboard() {
    console.log('Testing Admin Dashboard Functions...');
    
    // Test data loading
    console.log('Users:', adminData.users.length);
    console.log('Providers:', adminData.providers.length);
    console.log('Bookings:', adminData.bookings.length);
    
    // Test statistics
    console.log('Statistics:', adminData.statistics);
    
    // Test settings
    console.log('Settings:', adminData.settings);
    
    showNotification('Admin Dashboard test completed! Check console for details.', 'info');
}

// Export functions for global access
window.showSection = showSection;
window.exportUsers = exportUsers;
window.exportProviders = exportProviders;
window.generateReport = generateReport;
window.viewUser = viewUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.viewProvider = viewProvider;
window.editProvider = editProvider;
window.verifyProvider = verifyProvider;
window.deleteProvider = deleteProvider;
window.viewBooking = viewBooking;
window.editBooking = editBooking;
window.logout = logout;
window.testAdminDashboard = testAdminDashboard;
