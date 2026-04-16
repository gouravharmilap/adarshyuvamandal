// Data Management System for Adarsh Yuva Mandal
// Uses localStorage + Supabase for cloud sync

const isBrowser = typeof window !== 'undefined';

// ============================================
// SUPABASE CONFIGURATION
// Replace these with your actual Supabase credentials
// Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
// ============================================
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7kA6cm39MKy1ObVqZbwnA_7ns59Bk1';

// Cache-busting version
const DATA_VERSION = 10;

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
let useLocalOnly = false;

// Initialize Supabase client
function initSupabase() {
    if (!isBrowser) return false;

    // Check if credentials are configured
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        console.log('Supabase not configured - using localStorage only');
        useLocalOnly = true;
        return false;
    }

    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized');
            return true;
        }
    } catch (e) {
        console.error('Supabase init failed:', e.message);
        useLocalOnly = true;
    }
    return false;
}

// Initialize data - load from localStorage first, then sync with Supabase
async function initializeData() {
    console.log('initializeData called, DATA_VERSION:', DATA_VERSION);

    // Always load from localStorage first for immediate access
    try {
        const localData = localStorage.getItem('aym_data');
        if (localData) {
            cachedData = JSON.parse(localData);
            console.log('Loaded from localStorage');
        }
    } catch (e) {
        console.log('localStorage read failed:', e.message);
    }

    // Initialize Supabase
    initSupabase();

    // If Supabase is configured, try to sync with cloud
    if (supabase && !useLocalOnly) {
        try {
            console.log('Fetching from Supabase...');
            const { data, error } = await supabase
                .from('site_data')
                .select('data')
                .eq('id', 'main')
                .single();

            if (error) {
                console.log('Supabase fetch error:', error.message);
                // If table doesn't exist, try to create it
                if (error.code === '42P01') {
                    console.log('Table may not exist - run supabase-setup.sql');
                }
            } else if (data && data.data) {
                cachedData = data.data;
                console.log('Loaded from Supabase cloud');
                // Update localStorage with cloud data
                localStorage.setItem('aym_data', JSON.stringify(data.data));
            }
        } catch (e) {
            console.log('Supabase fetch failed:', e.message);
        }
    }

    // If still no data, use default
    if (!cachedData) {
        cachedData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        console.log('Using default data');
    }

    dataLoaded = true;
    console.log('Data ready');
}

// Synchronous getData
function getData() {
    if (cachedData) {
        return cachedData;
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Save data - always saves to localStorage, syncs to Supabase when available
async function saveData(data) {
    cachedData = data;

    // Always save to localStorage immediately
    try {
        localStorage.setItem('aym_data', JSON.stringify(data));
        localStorage.setItem('aym_data_version', DATA_VERSION);
    } catch (e) {
        console.error('localStorage save failed:', e);
    }

    // Also save to Supabase cloud if configured
    if (supabase && !useLocalOnly) {
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
                console.log('Supabase save error:', error.message);
            } else {
                console.log('Saved to Supabase cloud');
            }
        } catch (e) {
            console.error('Supabase save failed:', e.message);
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

// ============================================
// SETUP INSTRUCTIONS:
// ============================================
// 1. Go to https://supabase.com and create a new project
// 2. Go to Project Settings > API
// 3. Copy the "Project URL" and "anon public" key
// 4. Replace SUPABASE_URL and SUPABASE_ANON_KEY values above
// 5. Go to SQL Editor in Supabase dashboard and run supabase-setup.sql
// 6. Deploy your updated files
// ============================================
