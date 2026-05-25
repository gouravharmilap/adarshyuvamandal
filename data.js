const STORAGE_KEY = 'aym_website_data';

const defaultData = {
    updates: [],
    gallery: [],
    memories: [],
    thoughts: [],
    adminPassword: 'aym2026admin'
};

async function initializeData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
}

function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// PASSWORD
function getAdminPassword() {
    return getData().adminPassword;
}

async function setAdminPassword(password) {
    const data = getData();
    data.adminPassword = password;
    saveData(data);
}

// ==================== UPDATES ====================

function getUpdates() {
    return getData().updates.filter(u => u.active !== false);
}

function getAllUpdates() {
    return getData().updates;
}

function createUpdate(text) {
    const data = getData();

    data.updates.unshift({
        id: Date.now(),
        text: text,
        date: new Date().toISOString().split('T')[0],
        active: true
    });

    saveData(data);
}

function toggleUpdateStatus(id) {
    const data = getData();

    const item = data.updates.find(u => u.id === id);

    if (item) {
        item.active = !item.active;
    }

    saveData(data);
}

function removeUpdate(id) {
    const data = getData();

    data.updates = data.updates.filter(u => u.id !== id);

    saveData(data);
}

// ==================== GALLERY ====================

function getGallery() {
    return getData().gallery;
}

function createGalleryItem(src, title, description) {
    const data = getData();

    data.gallery.push({
        id: Date.now(),
        src,
        title,
        description
    });

    saveData(data);
}

function updateGalleryItem(id, src, title, description) {
    const data = getData();

    const item = data.gallery.find(g => g.id === id);

    if (item) {
        item.src = src;
        item.title = title;
        item.description = description;
    }

    saveData(data);
}

function removeGalleryItem(id) {
    const data = getData();

    data.gallery = data.gallery.filter(g => g.id !== id);

    saveData(data);
}

// ==================== MEMORIES ====================

function getMemories() {
    return getData().memories;
}

function createMemory(src, title, description, date) {
    const data = getData();

    data.memories.push({
        id: Date.now(),
        src,
        title,
        description,
        date
    });

    saveData(data);
}

function updateMemory(id, src, title, description, date) {
    const data = getData();

    const item = data.memories.find(m => m.id === id);

    if (item) {
        item.src = src;
        item.title = title;
        item.description = description;
        item.date = date;
    }

    saveData(data);
}

function removeMemory(id) {
    const data = getData();

    data.memories = data.memories.filter(m => m.id !== id);

    saveData(data);
}

// ==================== THOUGHTS ====================

function getThoughts() {
    return getData().thoughts;
}

function createThought(text) {
    const data = getData();

    data.thoughts.unshift({
        id: Date.now(),
        text,
        date: new Date().toLocaleDateString()
    });

    saveData(data);
}

function removeThought(id) {
    const data = getData();

    data.thoughts = data.thoughts.filter(t => t.id !== id);

    saveData(data);
}