// Pet management functionality
let currentUser = null;
let userPets = [];

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserPets();
    setupLocationServices();
});

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('petcare_token') || sessionStorage.getItem('petcare_token');
    const user = localStorage.getItem('petcare_user') || sessionStorage.getItem('petcare_user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    
    // Redirect providers to their dashboard
    if (currentUser.type === 'provider') {
        window.location.href = 'provider-dashboard.html';
        return;
    }
    
    updateLocationDisplay();
}

// Load user pets
function loadUserPets() {
    // Mock pet data - in real app, this would come from API
    userPets = [
        {
            id: 1,
            name: "Max",
            type: "dog",
            breed: "Golden Retriever",
            age: 3,
            gender: "male",
            color: "Golden",
            weight: 25.5,
            notes: "Very friendly, loves playing fetch. Allergic to chicken.",
            photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            vaccinations: [
                { name: "Rabies", date: "2023-12-01", nextDue: "2024-12-01" },
                { name: "DHPP", date: "2024-01-15", nextDue: "2025-01-15" }
            ],
            lastCheckup: "2024-01-15",
            nextCheckup: "2024-07-15"
        },
        {
            id: 2,
            name: "Luna",
            type: "cat",
            breed: "Persian",
            age: 2,
            gender: "female",
            color: "White",
            weight: 4.2,
            notes: "Indoor cat, very calm. Requires daily brushing.",
            photo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            vaccinations: [
                { name: "FVRCP", date: "2024-02-01", nextDue: "2025-02-01" }
            ],
            lastCheckup: "2024-02-01",
            nextCheckup: "2024-08-01"
        },
        {
            id: 3,
            name: "Charlie",
            type: "bird",
            breed: "Budgerigar",
            age: 1,
            gender: "male",
            color: "Blue and White",
            weight: 0.03,
            notes: "Very talkative, loves mirrors and toys.",
            photo: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            vaccinations: [],
            lastCheckup: "2024-01-10",
            nextCheckup: "2024-07-10"
        }
    ];
    
    displayPets();
    updatePetStats();
    loadHealthReminders();
}

// Display pets in the grid
function displayPets() {
    const container = document.getElementById('petsContainer');
    
    if (userPets.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-paw fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No pets added yet</h5>
                <p class="text-muted">Add your first pet to get started!</p>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPetModal">
                    <i class="fas fa-plus me-2"></i>Add Your First Pet
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userPets.map(pet => createPetCard(pet)).join('');
}

// Create pet card HTML
function createPetCard(pet) {
    const petIcon = getPetIcon(pet.type);
    const nextCheckup = new Date(pet.nextCheckup);
    const today = new Date();
    const daysUntilCheckup = Math.ceil((nextCheckup - today) / (1000 * 60 * 60 * 24));
    
    let checkupStatus = '';
    if (daysUntilCheckup < 0) {
        checkupStatus = '<span class="badge bg-danger">Overdue</span>';
    } else if (daysUntilCheckup <= 30) {
        checkupStatus = `<span class="badge bg-warning">Due in ${daysUntilCheckup} days</span>`;
    } else {
        checkupStatus = `<span class="badge bg-success">Next: ${formatDate(pet.nextCheckup)}</span>`;
    }
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card pet-card h-100 shadow-sm">
                <div class="card-img-top pet-image-container">
                    <img src="${pet.photo}" alt="${pet.name}" class="pet-image">
                    <div class="pet-type-badge">
                        <i class="${petIcon}"></i> ${pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${pet.name}</h5>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="editPet(${pet.id})">
                                    <i class="fas fa-edit me-2"></i>Edit
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="viewPetHistory(${pet.id})">
                                    <i class="fas fa-history me-2"></i>History
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="bookServiceForPet(${pet.id})">
                                    <i class="fas fa-calendar-plus me-2"></i>Book Service
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deletePet(${pet.id})">
                                    <i class="fas fa-trash me-2"></i>Delete
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="pet-details mb-3">
                        <small class="text-muted d-block">
                            <i class="fas fa-info-circle me-1"></i>
                            ${pet.breed || 'Mixed breed'} • ${pet.age} ${pet.age === 1 ? 'year' : 'years'} old • ${pet.gender || 'Unknown'}
                        </small>
                        ${pet.weight ? `<small class="text-muted d-block">
                            <i class="fas fa-weight me-1"></i>Weight: ${pet.weight} kg
                        </small>` : ''}
                        ${pet.color ? `<small class="text-muted d-block">
                            <i class="fas fa-palette me-1"></i>Color: ${pet.color}
                        </small>` : ''}
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="fw-bold">Health Status:</small>
                            ${checkupStatus}
                        </div>
                    </div>
                    
                    ${pet.notes ? `
                        <div class="mb-3">
                            <small class="text-muted">
                                <i class="fas fa-sticky-note me-1"></i>
                                ${pet.notes.length > 60 ? pet.notes.substring(0, 60) + '...' : pet.notes}
                            </small>
                        </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-light">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="bookServiceForPet(${pet.id})">
                            <i class="fas fa-calendar-plus me-2"></i>Book Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get pet icon based on type
function getPetIcon(type) {
    const icons = {
        dog: 'fas fa-dog',
        cat: 'fas fa-cat',
        bird: 'fas fa-dove',
        rabbit: 'fas fa-rabbit',
        fish: 'fas fa-fish',
        hamster: 'fas fa-hamster',
        other: 'fas fa-paw'
    };
    return icons[type] || icons.other;
}

// Update pet statistics
function updatePetStats() {
    document.getElementById('totalPets').textContent = userPets.length;
    
    // Count upcoming appointments (mock data)
    const upcomingAppointments = userPets.filter(pet => {
        const nextCheckup = new Date(pet.nextCheckup);
        const today = new Date();
        const daysUntil = Math.ceil((nextCheckup - today) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 30;
    }).length;
    
    document.getElementById('upcomingAppointments').textContent = upcomingAppointments;
    
    // Count health reminders
    let healthReminders = 0;
    userPets.forEach(pet => {
        pet.vaccinations.forEach(vacc => {
            const nextDue = new Date(vacc.nextDue);
            const today = new Date();
            const daysUntil = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
            if (daysUntil <= 30) healthReminders++;
        });
    });
    
    document.getElementById('healthReminders').textContent = healthReminders;
    
    // Mock services used
    document.getElementById('servicesUsed').textContent = userPets.length * 3;
}

// Load health reminders
function loadHealthReminders() {
    const container = document.getElementById('healthRemindersContainer');
    const reminders = [];
    
    userPets.forEach(pet => {
        // Check vaccination reminders
        pet.vaccinations.forEach(vacc => {
            const nextDue = new Date(vacc.nextDue);
            const today = new Date();
            const daysUntil = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
            
            if (daysUntil <= 30) {
                reminders.push({
                    type: 'vaccination',
                    pet: pet.name,
                    message: `${vacc.name} vaccination due`,
                    date: vacc.nextDue,
                    daysUntil: daysUntil,
                    priority: daysUntil < 0 ? 'high' : 'medium'
                });
            }
        });
        
        // Check checkup reminders
        const nextCheckup = new Date(pet.nextCheckup);
        const today = new Date();
        const daysUntil = Math.ceil((nextCheckup - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 30) {
            reminders.push({
                type: 'checkup',
                pet: pet.name,
                message: 'Regular checkup due',
                date: pet.nextCheckup,
                daysUntil: daysUntil,
                priority: daysUntil < 0 ? 'high' : 'low'
            });
        }
    });
    
    if (reminders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
                <p class="text-muted mb-0">All your pets are up to date with their health requirements!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reminders.map(reminder => {
        const priorityClass = reminder.priority === 'high' ? 'border-danger' : 
                             reminder.priority === 'medium' ? 'border-warning' : 'border-info';
        const iconClass = reminder.type === 'vaccination' ? 'fas fa-syringe' : 'fas fa-stethoscope';
        
        return `
            <div class="alert alert-light ${priorityClass} border-start border-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">
                            <i class="${iconClass} me-2"></i>${reminder.pet} - ${reminder.message}
                        </h6>
                        <small class="text-muted">
                            ${reminder.daysUntil < 0 ? 
                                `Overdue by ${Math.abs(reminder.daysUntil)} days` : 
                                `Due in ${reminder.daysUntil} days`} (${formatDate(reminder.date)})
                        </small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="bookVetAppointment('${reminder.pet}')">
                        Book Appointment
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Add new pet
function addNewPet() {
    const form = document.getElementById('addPetForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!formData.get('petName') || !formData.get('petType')) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    // Create new pet object
    const newPet = {
        id: Date.now(),
        name: formData.get('petName'),
        type: formData.get('petType'),
        breed: formData.get('breed') || '',
        age: parseInt(formData.get('age')) || 0,
        gender: formData.get('gender') || '',
        color: formData.get('color') || '',
        weight: parseFloat(formData.get('weight')) || 0,
        notes: formData.get('notes') || '',
        photo: getDefaultPetPhoto(formData.get('petType')),
        vaccinations: [],
        lastCheckup: new Date().toISOString().split('T')[0],
        nextCheckup: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 6 months from now
    };
    
    // Add to pets array
    userPets.push(newPet);
    
    // Update display
    displayPets();
    updatePetStats();
    loadHealthReminders();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addPetModal')).hide();
    form.reset();
    
    showNotification(`${newPet.name} has been added successfully!`, 'success');
}

// Edit pet
function editPet(petId) {
    const pet = userPets.find(p => p.id === petId);
    if (!pet) return;
    
    // Populate form
    document.getElementById('editPetId').value = pet.id;
    document.getElementById('editPetName').value = pet.name;
    document.getElementById('editPetType').value = pet.type;
    document.getElementById('editBreed').value = pet.breed || '';
    document.getElementById('editAge').value = pet.age || '';
    document.getElementById('editGender').value = pet.gender || '';
    document.getElementById('editColor').value = pet.color || '';
    document.getElementById('editWeight').value = pet.weight || '';
    document.getElementById('editNotes').value = pet.notes || '';
    
    // Show modal
    new bootstrap.Modal(document.getElementById('editPetModal')).show();
}

// Update pet
function updatePet() {
    const form = document.getElementById('editPetForm');
    const formData = new FormData(form);
    const petId = parseInt(formData.get('petId'));
    
    const petIndex = userPets.findIndex(p => p.id === petId);
    if (petIndex === -1) return;
    
    // Update pet data
    userPets[petIndex] = {
        ...userPets[petIndex],
        name: formData.get('petName'),
        type: formData.get('petType'),
        breed: formData.get('breed') || '',
        age: parseInt(formData.get('age')) || 0,
        gender: formData.get('gender') || '',
        color: formData.get('color') || '',
        weight: parseFloat(formData.get('weight')) || 0,
        notes: formData.get('notes') || ''
    };
    
    // Update display
    displayPets();
    updatePetStats();
    loadHealthReminders();
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('editPetModal')).hide();
    
    showNotification(`${userPets[petIndex].name}'s information has been updated!`, 'success');
}

// Delete pet
function deletePet(petId) {
    const pet = userPets.find(p => p.id === petId);
    if (!pet) return;
    
    if (confirm(`Are you sure you want to remove ${pet.name} from your pets? This action cannot be undone.`)) {
        userPets = userPets.filter(p => p.id !== petId);
        displayPets();
        updatePetStats();
        loadHealthReminders();
        showNotification(`${pet.name} has been removed from your pets.`, 'info');
    }
}

// Book service for specific pet
function bookServiceForPet(petId) {
    const pet = userPets.find(p => p.id === petId);
    if (!pet) return;
    
    // Redirect to services page with pet selected
    sessionStorage.setItem('selectedPetId', petId);
    window.location.href = 'services.html';
}

// Book vet appointment
function bookVetAppointment(petName) {
    showNotification('Redirecting to nearby veterinary clinics...', 'info');
    setTimeout(() => {
        window.location.href = 'nearby.html?filter=vet';
    }, 1000);
}

// View pet history
function viewPetHistory(petId) {
    const pet = userPets.find(p => p.id === petId);
    if (!pet) return;
    
    showNotification(`Viewing history for ${pet.name}`, 'info');
    // In a real app, this would open a detailed history modal or page
}

// Sort pets
function sortPets(criteria) {
    if (criteria === 'name') {
        userPets.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'age') {
        userPets.sort((a, b) => (b.age || 0) - (a.age || 0));
    }
    displayPets();
}

// Filter pets
function filterPets(type) {
    // For now, just show all pets
    // In a more complex app, you could filter by pet type
    displayPets();
}

// Get default pet photo
function getDefaultPetPhoto(type) {
    const defaultPhotos = {
        dog: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        cat: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        bird: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        fish: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        other: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    };
    return defaultPhotos[type] || defaultPhotos.other;
}

// Location services
function setupLocationServices() {
    updateLocationDisplay();
}

function updateLocationDisplay() {
    if (currentUser) {
        document.getElementById('current-location').textContent = currentUser.location || 'Dhaka, Bangladesh';
    }
}

function changeLocation() {
    const newLocation = prompt('Enter your new location:', document.getElementById('current-location').textContent);
    if (newLocation && newLocation.trim()) {
        currentUser.location = newLocation.trim();
        
        // Update stored user data
        if (localStorage.getItem('petcare_user')) {
            localStorage.setItem('petcare_user', JSON.stringify(currentUser));
        }
        if (sessionStorage.getItem('petcare_user')) {
            sessionStorage.setItem('petcare_user', JSON.stringify(currentUser));
        }
        
        updateLocationDisplay();
        showNotification('Location updated successfully!', 'success');
    }
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
window.addNewPet = addNewPet;
window.editPet = editPet;
window.updatePet = updatePet;
window.deletePet = deletePet;
window.bookServiceForPet = bookServiceForPet;
window.bookVetAppointment = bookVetAppointment;
window.viewPetHistory = viewPetHistory;
window.sortPets = sortPets;
window.filterPets = filterPets;
window.changeLocation = changeLocation;
window.logout = logout;
