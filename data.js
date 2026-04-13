// Data Management System for Adarsh Yuva Mandal
// Uses localStorage + Supabase for cloud sync

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Supabase Configuration
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsa2pvcHBqbW9qdHVka2tpcGoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY4MzgxOTIwMCwiZXhwIjoxOTk5Mzk1MjAwfQ.u5M0b5K8Z4K5Q5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5';

// Default admin password
const DEFAULT_ADMIN_PASSWORD = "aym2026admin";

// Default data structure
const DEFAULT_DATA = {
    updates: [
        { id: 1, text: "🎉 Vishal Jagaran 2026 registrations now open!", date: "2026-04-10", active: true }
    ],
    gallery: [],
    memories: [],
    thoughts: []
};

// Global data cache
let cachedData = null;
let dataLoaded = false;
let supabase = null;

// Try to initialize Supabase
function initSupabase() {
    if (!isBrowser) return;

    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized');
        }
    } catch (e) {
        console.log('Supabase init failed:', e.message);
    }
}

// Initialize data - tries Supabase first, falls back to localStorage
async function initializeData() {
    console.log('initializeData called');

    // First try to load from localStorage as immediate fallback
    try {
        const localData = localStorage.getItem('aym_data');
        if (localData) {
            cachedData = JSON.parse(localData);
            console.log('Loaded from localStorage');
        }
    } catch (e) {
        console.log('localStorage read failed');
    }

    // Then try Supabase
    if (supabase) {
        try {
            console.log('Fetching from Supabase...');
            const { data, error } = await supabase
                .from('site_data')
                .select('data')
                .eq('id', 'main')
                .single();

            if (!error && data && data.data) {
                cachedData = data.data;
                console.log('Loaded from Supabase');
                // Also save to localStorage for offline
                localStorage.setItem('aym_data', JSON.stringify(data.data));
            }
        } catch (e) {
            console.log('Supabase fetch failed:', e.message);
        }
    }

    // If still no data, use default
    if (!cachedData) {
        cachedData = { ...DEFAULT_DATA };
        console.log('Using default data');
    }

    dataLoaded = true;
}

// Synchronous getData
function getData() {
    if (cachedData) {
        return cachedData;
    }
    return { ...DEFAULT_DATA };
}

// Save data
async function saveData(data) {
    cachedData = data;

    // Save to localStorage immediately
    try {
        localStorage.setItem('aym_data', JSON.stringify(data));
    } catch (e) {
        console.log('localStorage save failed');
    }

    // Save to Supabase async
    if (supabase) {
        try {
            await supabase
                .from('site_data')
                .upsert({
                    id: 'main',
                    data: data,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'id'
                });
            console.log('Saved to Supabase');
        } catch (e) {
            console.log('Supabase save failed:', e.message);
        }
    }
}

// ===== ADMIN PASSWORD =====
function setAdminPassword(password) {
    const data = getData();
    data.adminPassword = password;
    saveData(data);
}

function getAdminPassword() {
    const data = getData();
    return data.adminPassword || DEFAULT_ADMIN_PASSWORD;
}

function verifyAdminPassword(password) {
    console.log('verifyAdminPassword called, input:', password, 'stored:', getAdminPassword());
    return password === getAdminPassword();
}

function isLoggedIn() {
    return sessionStorage.getItem('aym_admin_logged_in') === 'true';
}

function setLoggedIn(value) {
    sessionStorage.setItem('aym_admin_logged_in', value ? 'true' : 'false');
}

// ===== UPDATE FUNCTIONS =====
function getUpdates() {
    const data = getData();
    return (data.updates || []).filter(u => u.active);
}

function getAllUpdates() {
    return getData().updates || [];
}

function createUpdate(text) {
    const data = getData();
    if (!data.updates) data.updates = [];
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
    if (!data.updates) data.updates = [];
    const update = data.updates.find(u => u.id === id);
    if (update) {
        update.active = !update.active;
        saveData(data);
    }
}

function removeUpdate(id) {
    const data = getData();
    if (!data.updates) data.updates = [];
    data.updates = data.updates.filter(u => u.id !== id);
    saveData(data);
}

// ===== GALLERY FUNCTIONS =====
function getGallery() {
    return getData().gallery || [];
}

function createGalleryItem(src, title, description) {
    const data = getData();
    if (!data.gallery) data.gallery = [];
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
    if (!data.gallery) data.gallery = [];
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
    if (!data.gallery) data.gallery = [];
    data.gallery = data.gallery.filter(item => item.id !== id);
    saveData(data);
}

// ===== MEMORIES FUNCTIONS =====
function getMemories() {
    return getData().memories || [];
}

function createMemory(src, title, description, date) {
    const data = getData();
    if (!data.memories) data.memories = [];
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
    if (!data.memories) data.memories = [];
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
    if (!data.memories) data.memories = [];
    data.memories = data.memories.filter(m => m.id !== id);
    saveData(data);
}

// ===== THOUGHTS FUNCTIONS =====
function getThoughts() {
    return getData().thoughts || [];
}

function createThought(text) {
    const data = getData();
    if (!data.thoughts) data.thoughts = [];
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
    if (!data.thoughts) data.thoughts = [];
    data.thoughts = data.thoughts.filter(t => t.id !== id);
    saveData(data);
}

// Initialize when script loads
if (isBrowser) {
    initSupabase();
}
