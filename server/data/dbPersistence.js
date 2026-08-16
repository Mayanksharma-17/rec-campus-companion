const fs = require('fs');
const path = require('path');
const initialStore = require('./store');

const DB_FILE_SERVER = path.join(__dirname, 'db.json');
const DB_FILE_ROOT = path.join(__dirname, '../../database/db.json');
const DB_FILE_TMP = path.join(process.env.TMPDIR || '/tmp', 'rec_campus_db.json');

let liveStore = null;
let lastUpdatedTimestamp = Date.now();

function loadFromFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileData);
      if (parsed && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Could not read database from ${filePath}:`, err.message);
  }
  return null;
}

// Load persistent DB from file or initialize with store.js seed data
function initDatabase() {
  liveStore = loadFromFile(DB_FILE_TMP) || loadFromFile(DB_FILE_ROOT) || loadFromFile(DB_FILE_SERVER);

  if (!liveStore) {
    liveStore = {
      users: initialStore.users,
      timetables: initialStore.timetables,
      events: initialStore.events,
      lostFoundItems: initialStore.lostFoundItems,
      clubAnnouncements: initialStore.clubAnnouncements,
      messData: initialStore.messData,
      canteenData: initialStore.canteenData,
      transportData: initialStore.transportData
    };
    console.log('🌱 Database initialized with initial seed data');
  } else {
    console.log('📦 Persistent database loaded successfully');
  }

  if (!liveStore.transportData) {
    liveStore.transportData = initialStore.transportData;
  }

  saveDatabase();
}

function getDatabase() {
  if (!liveStore) {
    initDatabase();
  }
  return liveStore;
}

function saveDatabase() {
  try {
    lastUpdatedTimestamp = Date.now();
    const jsonContent = JSON.stringify(liveStore, null, 2);

    [DB_FILE_TMP, DB_FILE_ROOT, DB_FILE_SERVER].forEach(filePath => {
      try {
        fs.writeFileSync(filePath, jsonContent, 'utf8');
      } catch (e) {
        // Ignore errors on read-only environments
      }
    });
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

function getLastUpdated() {
  return lastUpdatedTimestamp;
}

module.exports = {
  initDatabase,
  getDatabase,
  saveDatabase,
  getLastUpdated
};
