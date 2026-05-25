const STORAGE_KEY = 'aym_website_data';
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';
const SUPABASE_ANON_KEY = 'sbp_3153c74aef155e7dd27b8afb490da311d2059941';

let supabaseClient = null;

// Initialization
if (typeof supabase !== 'undefined') {
    if (SUPABASE_ANON_KEY !== 'sbp_3153c74aef155e7dd27b8afb490da311d2059941') {
        console.log('Supabase: Initializing client...');
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase Error: You are still using the placeholder ANON_KEY. Cloud sync will not work.');
    }
} else {
    console.error('Supabase Error: Library not found! Make sure <script src=".../supabase-js"></script> is in your HTML.');
}

const defaultData = {
    updates: [],
    gallery: [
        { id: 1, src: 'club photo.jpg', title: 'Our Club', description: 'Adarsh Yuva Mandal Head Office' },
        { id: 2, src: 'background image.jpg', title: 'Celebration', description: 'Annual Event' }
    ],
    memories: [],
    thoughts: [],
    adminPassword: 'aym2026admin'
};

async function initializeData() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('site_data')
                .select('data')
                .eq('id', 'main')
                .maybeSingle(); // Better for fetching a single row

            if (error) throw error;

            if (data && data.data) {
                // Successfully got cloud data
                const cloudData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
                
                // Merge cloud data with local to ensure passwords etc exist
                const mergedData = { ...defaultData, ...cloudData };
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
                console.log('Supabase: Data synced from cloud');
                return;
            }
            
            // If table is empty, upload what we currently have in local storage to the cloud
            const localData = localStorage.getItem(STORAGE_KEY);
            if (localData) {
                console.log('Supabase: Cloud empty/new, pushing current local data...');
                saveData(JSON.parse(localData));
            }
        } catch (err) {
            console.error('Supabase Sync Failed:', err);
            console.warn('Operating in offline mode (LocalStorage only). Verify your API Key.');
        }
    }

    // Fallback if cloud fails or client not initialized
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