// Data Management System for Adarsh Yuva Mandal
// Uses Supabase for cloud storage (syncs across all devices)

// Supabase Configuration
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7kA6cm39MKy1ObVqZbwnA_7ns59Bk1';

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

// Initialize Supabase client
let supabase = null;
let isOnline = false;

// Initialize Supabase
function initSupabase() {
    console.log('Initializing Supabase...');
    console.log('window.supabase exists:', typeof window.supabase !== 'undefined');
    try {
        if (typeof window !== 'undefined' && window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            isOnline = true;
            console.log('Supabase client created successfully');
            return true;
        }
        console.log('Supabase SDK not loaded yet');
    } catch (e) {
        console.error('Error initializing Supabase:', e);
    }
    return false;
}

// Check if Supabase is loaded
if (typeof window !== 'undefined') {
    // Wait for SDK to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initSupabase, 500);
        });
    } else {
        setTimeout(initSupabase, 500);
    }
}

// Global data cache for synchronous access
let cachedData = null;
let dataLoaded = false;

// Load data from Supabase (async)
async function loadDataFromSupabase() {
    console.log('loadDataFromSupabase called, supabase:', !!supabase);
    if (!supabase) {
        console.log('Supabase not available, using defaults');
        return { ...DEFAULT_DATA };
    }

    try {
        console.log('Fetching data from Supabase...');
        const { data, error } = await supabase
            .from('site_data')
            .select('data')
            .eq('id', 'main')
            .single();

        if (error) {
            console.log('Error loading data:', error.message);
            return { ...DEFAULT_DATA };
        }

        console.log('Data from Supabase:', data);
        if (data && data.data) {
            cachedData = data.data;
            dataLoaded = true;
            return data.data;
        }
    } catch (e) {
        console.log('Failed to load from Supabase:', e.message);
    }

    return { ...DEFAULT_DATA };
}

// Save data to Supabase (async)
async function saveDataToSupabase(data) {
    if (!supabase) return false;

    try {
        const { error } = await supabase
            .from('site_data')
            .upsert({
                id: 'main',
                data: data,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });

        if (error) {
            console.log('Error saving data:', error.message);
            return false;
        }
        cachedData = data;
        return true;
    } catch (e) {
        console.log('Failed to save to Supabase:', e.message);
        return false;
    }
}

// Synchronous getData - returns cached data or default
function getData() {
    if (cachedData) {
        return cachedData;
    }
    return { ...DEFAULT_DATA };
}

// Initialize data on load
async function initializeData() {
    cachedData = await loadDataFromSupabase();
    dataLoaded = true;
}

// ===== ADMIN PASSWORD =====
function setAdminPassword(password) {
    const data = getData();
    data.adminPassword = password;
    saveDataToSupabase(data);
}

function getAdminPassword() {
    const data = getData();
    return data.adminPassword || DEFAULT_ADMIN_PASSWORD;
}

function verifyAdminPassword(password) {
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
    saveDataToSupabase(data);
    return newUpdate;
}

function toggleUpdateStatus(id) {
    const data = getData();
    const update = data.updates.find(u => u.id === id);
    if (update) {
        update.active = !update.active;
        saveDataToSupabase(data);
    }
}

function removeUpdate(id) {
    const data = getData();
    data.updates = data.updates.filter(u => u.id !== id);
    saveDataToSupabase(data);
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
    saveDataToSupabase(data);
    return newItem;
}

function updateGalleryItem(id, src, title, description) {
    const data = getData();
    if (!data.gallery) data.gallery = [];
    const index = data.gallery.findIndex(item => item.id === id);
    if (index !== -1) {
        data.gallery[index] = { id, src, title, description: description || '' };
        saveDataToSupabase(data);
        return true;
    }
    return false;
}

function removeGalleryItem(id) {
    const data = getData();
    if (!data.gallery) data.gallery = [];
    data.gallery = data.gallery.filter(item => item.id !== id);
    saveDataToSupabase(data);
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
    saveDataToSupabase(data);
    return newMemory;
}

function updateMemory(id, src, title, description, date) {
    const data = getData();
    if (!data.memories) data.memories = [];
    const index = data.memories.findIndex(m => m.id === id);
    if (index !== -1) {
        data.memories[index] = { id, src, title, description: description || '', date: date || '' };
        saveDataToSupabase(data);
        return true;
    }
    return false;
}

function removeMemory(id) {
    const data = getData();
    if (!data.memories) data.memories = [];
    data.memories = data.memories.filter(m => m.id !== id);
    saveDataToSupabase(data);
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
    saveDataToSupabase(data);
    return newThought;
}

function removeThought(id) {
    const data = getData();
    if (!data.thoughts) data.thoughts = [];
    data.thoughts = data.thoughts.filter(t => t.id !== id);
    saveDataToSupabase(data);
}

// Initialize on load - start async load
initializeData();
