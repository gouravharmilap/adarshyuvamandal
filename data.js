const STORAGE_KEY = 'aym_website_data';
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';

// FIX: You were using a Stripe key. Replace this with your actual Supabase 'anon public' key.
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

let supabaseClient = null;

// Only initialize if the library is loaded and keys aren't the default placeholders
if (typeof supabase !== 'undefined' && SUPABASE_URL.includes('supabase.co')) {
    console.log('Supabase: Initializing client...');
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const defaultData = {
    updates: [],
    gallery: [
        { id: 1, src: 'club photo.jpg', title: 'Our Club', description: 'Adarsh Yuva Mandal Head Office' }
    ],
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
                .eq('id', 'main');

            if (error) throw error;

            if (data && data.length > 0) {
                // Data found in cloud, sync it to local storage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data[0].data));
                console.log('Supabase: Data synced from cloud');
                return;
            }
            
            // If table is empty, upload what we currently have in local storage to the cloud
            const localData = localStorage.getItem(STORAGE_KEY);
            if (localData) {
                console.log('Supabase: Cloud empty, pushing local data...');
                saveData(JSON.parse(localData));
            }
        } catch (err) {
            console.error('Supabase Sync Failed:', err.message || err);
            console.warn('Operating in offline mode (LocalStorage only). Verify your API Key.');
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