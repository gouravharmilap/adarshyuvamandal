const STORAGE_KEY = 'aym_website_data';
const SUPABASE_URL = 'https://dlkjoppjmojmudtkkipj.supabase.co';

// 1. Replace this placeholder with your REAL Supabase 'anon' key (starts with eyJ...)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsa2pvcHBqbW9qbXVkdGtraXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDAxOTEsImV4cCI6MjA5MTY3NjE5MX0.uGfMM2k5LkajACxyAgxnH-y8XxaVM_CDhxJ9LEAb-7g'; // User provided this key, assuming it's correct.

let supabaseClient = null;

// Initialization
if (typeof supabase !== 'undefined') {
    // Check if the key looks like a valid Supabase key (starts with eyJ)
    if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.startsWith('eyJ')) { // Added check for null/empty key
        console.log('Supabase: Initializing cloud sync...');
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') { // Check for the placeholder specifically
        console.error('Supabase Error: You are still using the placeholder ANON_KEY. Cloud sync will not work.');
    } else {
        console.error('Supabase Error: The provided key is invalid. Cloud sync will not work.');
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
                .maybeSingle(); // Use maybeSingle to get a single object or null

            if (error) throw error;

            if (data && data.data) { // 'data' here is the row object from maybeSingle
                // Successfully got cloud data
                const cloudData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;

                // Deep merge logic: ensure all required keys exist
                const mergedData = {
                    ...defaultData,
                    ...cloudData,
                    updates: cloudData.updates || [],
                    gallery: cloudData.gallery || defaultData.gallery,
                    memories: cloudData.memories || [],
                    thoughts: cloudData.thoughts || []
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
                console.log('Supabase: Data synced from cloud');
                return;
            }
            // If table is empty, upload what we currently have in local storage to the cloud
            const localData = localStorage.getItem(STORAGE_KEY);
            if (localData) {
                console.log('Supabase: Cloud is empty, uploading initial data from this device...');
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
        console.log('LocalStorage empty, initializing with default data.');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
}

function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultData;

    try {
        const parsed = JSON.parse(data);
        // Ensure arrays are initialized to prevent frontend errors
        ['updates', 'gallery', 'memories', 'thoughts'].forEach(key => {
            if (!parsed[key]) parsed[key] = [];
        });
        return parsed;
    } catch (e) {
        return defaultData;
    }
}

async function saveData(data) {
    // Save locally immediately for a responsive UI
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Sync to Supabase in the background
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('site_data')
            .upsert({ id: 'main', data: data })
            if (error) throw error;
            console.log('Supabase: Data successfully synced to cloud.');
        } catch (error) {
            console.error('Supabase sync error:', error.message);
        }
    }
}

// ==================== MEDIA UPLOAD ====================

async function uploadMedia(file, folder) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized. Cannot upload file.');
        return null;
    }

    // If input is already a URL string or no file was selected, return it as is
    if (typeof file === 'string' || !file) return file;

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`; // Unique filename
    const filePath = `${folder}/${fileName}`;

    try {
        const { error: uploadError } = await supabaseClient.storage
            .from('website-media') // Assuming a bucket named 'website-media'
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseClient.storage.from('website-media').getPublicUrl(filePath);
        return publicUrlData.publicUrl;

    } catch (error) {
        console.error('Error uploading file to Supabase Storage:', error.message);
        return null;
    }
}

// PASSWORD
function getAdminPassword() {
    return getData().adminPassword;
}

async function setAdminPassword(password) {
    const data = getData();
    data.adminPassword = password;
    await saveData(data);
}

// ==================== UPDATES ====================

function getUpdates() {
    return getData().updates.filter(u => u.active !== false);
}

function getAllUpdates() {
    return getData().updates;
}

async function createUpdate(text) {
    const data = getData();

    data.updates.unshift({
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('en-GB'),
        active: true
    });

    await saveData(data);
}

async function toggleUpdateStatus(id) {
    const data = getData();

    const item = data.updates.find(u => u.id === id);

    if (item) {
        item.active = !item.active;
    }

    await saveData(data);
}

async function removeUpdate(id) {
    const data = getData();

    data.updates = data.updates.filter(u => u.id !== id);

    await saveData(data);
}

// ==================== GALLERY ====================

function getGallery() { // This will now return items from defaultData if Supabase is empty
    return getData().gallery;
}

async function createGalleryItem(file, title, description) { // Now accepts a file
    const imageUrl = await uploadMedia(file, 'gallery'); // Upload to 'gallery' folder
    if (!imageUrl) {
        console.error('Failed to upload gallery image. Item not created.');
        return;
    }

    const data = getData(); // Get latest data after upload

    data.gallery.push({
        id: Date.now(),
        src: imageUrl, // Store the public URL
        title,
        description
    });

    await saveData(data);
}

async function updateGalleryItem(id, file, title, description) { // Added file parameter
    const data = getData();
    const item = data.gallery.find(g => g.id === id);

    if (item) {
        if (file) { // If a new file is provided, upload it
            const imageUrl = await uploadMedia(file, 'gallery');
            if (imageUrl) {
                item.src = imageUrl;
            } else {
                console.warn('Failed to upload new image for gallery item, keeping old image.');
            }
        }
        item.title = title;
        item.description = description;
    }

    await saveData(data);
}

async function removeGalleryItem(id) {
    const data = getData();

    data.gallery = data.gallery.filter(g => g.id !== id);

    await saveData(data);
}

// ==================== MEMORIES ====================

function getMemories() { // This will now return items from defaultData if Supabase is empty
    return getData().memories;
}

async function createMemory(file, title, description, date) { // Now accepts a file
    const imageUrl = await uploadMedia(file, 'memories'); // Upload to 'memories' folder
    if (!imageUrl) {
        console.error('Failed to upload memory image. Item not created.');
        return;
    }

    const data = getData(); // Get latest data after upload

    data.memories.push({
        id: Date.now(),
        src: imageUrl, // Store the public URL
        title,
        description,
        date
    });

    await saveData(data);
}

async function updateMemory(id, file, title, description, date) { // Added file parameter
    const data = getData();
    const item = data.memories.find(m => m.id === id);

    if (item) {
        if (file) { // If a new file is provided, upload it
            const imageUrl = await uploadMedia(file, 'memories');
            if (imageUrl) {
                item.src = imageUrl;
            } else {
                console.warn('Failed to upload new image for memory item, keeping old image.');
            }
        }
        item.title = title;
        item.description = description;
        item.date = date;
    }

    await saveData(data);
}

async function removeMemory(id) {
    const data = getData();

    data.memories = data.memories.filter(m => m.id !== id);

    await saveData(data);
}

// ==================== THOUGHTS ====================

function getThoughts() {
    return getData().thoughts;
}

async function createThought(text) {
    const data = getData();

    data.thoughts.unshift({
        id: Date.now(),
        text,
        date: new Date().toLocaleDateString('en-GB')
    });

    await saveData(data);
}

async function removeThought(id) {
    const data = getData();

    data.thoughts = data.thoughts.filter(t => t.id !== id);

    await saveData(data);
}