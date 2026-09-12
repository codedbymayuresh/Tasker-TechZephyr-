const path = require('path');
// Ye line automatically sahi .env file dhund legi chahe tum kahin se bhi run karo
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Item = require('../models/Item');

const CYBERPUNK_ITEMS = [
  { name: 'NEON OVERDRIVE HUD', description: 'Cosmetic upgrade. Unlocks custom neon UI colors.', cost: 50, type: 'theme', iconKey: 'theme-neon' },
  { name: 'NEURAL STIMULANT', description: 'Boosts XP gain by 1.5x for the next 3 quests.', cost: 100, type: 'badge', iconKey: 'boost-xp' },
  { name: 'ICE BREAKER SCRIPT', description: 'Auto-completes one daily task instantly.', cost: 250, type: 'badge', iconKey: 'util-ice' },
  { name: 'CYBER-HOUND DRONE', description: 'Virtual pet companion for your dashboard.', cost: 500, type: 'title', iconKey: 'pet-drone' },
];

const run = async () => {
  try {
    // Check for MONGO_URI, fallback to local DB just in case
    const dbURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/life-rpg';
    
    await mongoose.connect(dbURI);
    console.log('[SYSTEM]: CONNECTED TO DATABASE');

    await Item.deleteMany({});
    await Item.insertMany(CYBERPUNK_ITEMS);
    
    console.log(`[SUCCESS]: Seeded ${CYBERPUNK_ITEMS.length} cyberpunk shop items into the Black Market.`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[ERROR]:', err);
    process.exit(1);
  }
};

run();