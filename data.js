// Data Management System for Adarsh Yuva Mandal
// Uses localStorage for persistence

// Default admin password
const DEFAULT_ADMIN_PASSWORD = "aym2026admin";

// Default data with local image references
const DEFAULT_DATA = {
    updates: [
        { id: 1, text: "🎉 Vishal Jagaran 2026 registrations now open!", date: "2026-04-10", active: true },
        { id: 2, text: "📅 Next club meeting: April 20, 2026 at 6 PM", date: "2026-04-08", active: true }
    ],
    gallery: [
        { id: 1, src: "logo.jpg", title: "आदर्श युवा मंडल", description: "Our Pride - Adarsh Yuva Mandal Logo" },
        { id: 2, src: "club photo.jpg", title: "Club Members", description: "United in spirit, bonded by tradition" },
        { id: 3, src: "memories.jpg", title: "Annual Gathering", description: "Cherished moments of unity and joy" },
        { id: 4, src: "memories 2.jpg", title: "Vishal Jagaran", description: "Our grand cultural celebration" }
    ],
    memories: [
        { id: 1, src: "memories.jpg", title: "Annual Gathering 2024", description: "Our beloved members coming together for the annual celebration, filled with joy, devotion, and memorable performances.", date: "2024" },
        { id: 2, src: "memories 2.jpg", title: "Vishal Jagaran Festival", description: "The grand celebration of our signature cultural festival featuring music, dance, and spiritual programs.", date: "2024" },
        { id: 3, src: "club photo.jpg", title: "Social Welfare Initiative", description: "Our members actively participating in community service, spreading joy and making a difference in lives.", date: "2024" }
    ],
    thoughts: [
        { id: 1, text: "संस्कृति को जीवित रखो, दिल को जोड़ो।", date: "2026-04-01" },
        { id: 2, text: "Youth is the strength of tomorrow's society.", date: "2026-03-15" }
    ]
};

// Initialize data
function initializeData() {
    try {
        var existing = localStorage.getItem('aym_data');
        if (!existing) {
            localStorage.setItem('aym_data', JSON.stringify(DEFAULT_DATA));
        } else {
            // Validate existing data is valid JSON
            JSON.parse(existing);
        }
    } catch (e) {
        // Corrupted data - reset to defaults
        localStorage.setItem('aym_data', JSON.stringify(DEFAULT_DATA));
    }
}

// Get all data
function getData() {
    initializeData();
    const data = localStorage.getItem('aym_data');
    return data ? JSON.parse(data) : DEFAULT_DATA;
}

// Save data
function saveData(data) {
    localStorage.setItem('aym_data', JSON.stringify(data));
}

// Reset to default data
function resetData() {
    localStorage.setItem('aym_data', JSON.stringify(DEFAULT_DATA));
}

// ===== ADMIN PASSWORD =====
function setAdminPassword(password) {
    localStorage.setItem('aym_admin_password', password);
}

function getAdminPassword() {
    return localStorage.getItem('aym_admin_password') || DEFAULT_ADMIN_PASSWORD;
}

function verifyAdminPassword(password) {
    return password === getAdminPassword();
}

function isLoggedIn() {
    return localStorage.getItem('aym_admin_logged_in') === 'true';
}

function setLoggedIn(value) {
    localStorage.setItem('aym_admin_logged_in', value ? 'true' : 'false');
}

// ===== UPDATE FUNCTIONS =====
function getUpdates() {
    return getData().updates.filter(u => u.active);
}

function getAllUpdates() {
    return getData().updates;
}

function createUpdate(text) {
    const data = getData();
    const newUpdate = {
        id: Date.now(),
        text: text,
        date: new Date().toISOString().split('T')[0],
        active: true
    };
    data.updates.unshift(newUpdate);
    saveData(data);
    return newUpdate;
}

function toggleUpdateStatus(id) {
    const data = getData();
    const update = data.updates.find(u => u.id === id);
    if (update) {
        update.active = !update.active;
        saveData(data);
    }
}

function removeUpdate(id) {
    const data = getData();
    data.updates = data.updates.filter(u => u.id !== id);
    saveData(data);
}

// ===== GALLERY FUNCTIONS =====
function getGallery() {
    return getData().gallery;
}

function createGalleryItem(src, title, description) {
    const data = getData();
    const newItem = {
        id: Date.now(),
        src: src,
        title: title,
        description: description || ''
    };
    data.gallery.push(newItem);
    saveData(data);
    return newItem;
}

function updateGalleryItem(id, src, title, description) {
    const data = getData();
    const index = data.gallery.findIndex(item => item.id === id);
    if (index !== -1) {
        data.gallery[index] = { id, src, title, description: description || '' };
        saveData(data);
        return true;
    }
    return false;
}

function removeGalleryItem(id) {
    const data = getData();
    data.gallery = data.gallery.filter(item => item.id !== id);
    saveData(data);
}

// ===== MEMORIES FUNCTIONS =====
function getMemories() {
    return getData().memories;
}

function createMemory(src, title, description, date) {
    const data = getData();
    const newMemory = {
        id: Date.now(),
        src: src,
        title: title,
        description: description || '',
        date: date || new Date().getFullYear().toString()
    };
    data.memories.push(newMemory);
    saveData(data);
    return newMemory;
}

function updateMemory(id, src, title, description, date) {
    const data = getData();
    const index = data.memories.findIndex(m => m.id === id);
    if (index !== -1) {
        data.memories[index] = { id, src, title, description: description || '', date: date || '' };
        saveData(data);
        return true;
    }
    return false;
}

function removeMemory(id) {
    const data = getData();
    data.memories = data.memories.filter(m => m.id !== id);
    saveData(data);
}

// ===== THOUGHTS FUNCTIONS =====
function getThoughts() {
    return getData().thoughts;
}

function createThought(text) {
    const data = getData();
    const newThought = {
        id: Date.now(),
        text: text,
        date: new Date().toISOString().split('T')[0]
    };
    data.thoughts.unshift(newThought);
    saveData(data);
    return newThought;
}

function removeThought(id) {
    const data = getData();
    data.thoughts = data.thoughts.filter(t => t.id !== id);
    saveData(data);
}

// Initialize on load
initializeData();