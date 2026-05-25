const STORAGE_KEY = 'aym_website_data';
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_H7kA6cm39MKy1ObVqZbwnA_7ns59Bk1';

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'https://dlkjoppjmojmudtkkipj.supabase.co' && SUPABASE_ANON_KEY !== 'sb_publishable_H7kA6cm39MKy1ObVqZbwnA_7ns59Bk1') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const defaultData = {
    updates: [],
    gallery: [],
    memories: [],
    thoughts: [],
    adminPassword: 'aym2026admin'
};

async function initializeData() {
    // 1. Try to fetch from Supabase first
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('site_data')
                .select('data')
                .eq('id', 'main')
                .single();

            if (data && data.data) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
                console.log('Successfully synced with Supabase cloud');
                return;
            }
            if (error) console.warn('Supabase fetch notice:', error.message);
        } catch (err) {
            console.error('Supabase initialization failed:', err);
        }
    }

    // 2. Fallback to localStorage or default data
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
        saveData(defaultData);
    }
}

function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
}

function saveData(data) {
    // Save locally immediately for a responsive UI
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Sync to Supabase in the background
    if (supabaseClient) {
        supabaseClient.from('site_data')
            .upsert({ id: 'main', data: data })
            .then(({ error }) => {
                if (error) console.error('Supabase sync error:', error.message);
            });
    }
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