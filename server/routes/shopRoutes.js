const express = require('express');
const { getItems, purchaseItem } = require('../controllers/shopController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.use(protect);

router.get('/', getItems);

router.post('/purchase/:itemId', purchaseItem);
router.post('/buy', async (req, res) => {
  try {
    req.params.itemId = req.body.itemId;
    return purchaseItem(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Transaction failed' });
  }
});

// POST: Use an item from inventory with Custom Cyberpunk Item Effects & Level-Up check
router.post('/use-item', async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let itemIndex = user.inventory.findIndex(
      (item, idx) => 
        item._id.toString() === String(itemId) || 
        (item.itemId && item.itemId.toString() === String(itemId)) || 
        idx.toString() === String(itemId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in inventory.' });
    }

    const inventoryItem = user.inventory[itemIndex];
    let effectMessage = '';
    let leveledUp = false;
    let newLevel = user.level;

    const itemName = (inventoryItem.name || '').toUpperCase();

    // Custom Effects based on your 5 Cyberpunk items
    if (itemName.includes('NEURAL STIMULANT')) {
      const xpGain = 150;
      user.currentLevelXp += xpGain;
      effectMessage = `Neural Stimulant injected! +${xpGain} XP gained!`;
    } 
    else if (itemName.includes('ICE BREAKER')) {
      user.streak = (user.streak || 0) + 1;
      effectMessage = `Ice Breaker executed! Security bypassed, +1 Streak bonus!`;
    } 
    else if (itemName.includes('NEON OVERDRIVE')) {
      user.gold += 50; // Bonus credits reward
      effectMessage = `HUD Overdriven! System rewarded you with +50 CR!`;
    } 
    else if (itemName.includes('CYBER-HOUND DRONE')) {
      const xpGain = 200;
      user.currentLevelXp += xpGain;
      effectMessage = `Cyber-Hound Drone deployed! Network scanned for +${xpGain} XP!`;
    } 
    else {
      // Default fallback effect
      const xpGain = inventoryItem.effectValue || 100;
      user.currentLevelXp += xpGain;
      effectMessage = `${inventoryItem.name} protocol executed! +${xpGain} XP gained!`;
    }

    // Check for Level Up across all XP boosts
    while (user.currentLevelXp >= user.xpForNextLevel) {
      user.currentLevelXp -= user.xpForNextLevel;
      user.level += 1;
      user.xpForNextLevel = Math.floor(user.xpForNextLevel * 1.3);
      leveledUp = true;
      newLevel = user.level;
    }

    // Remove item from inventory after use
    user.inventory.splice(itemIndex, 1);
    await user.save();

    res.json({ 
      message: effectMessage, 
      rewards: { leveledUp, newLevel },
      user 
    });
  } catch (err) {
    console.error('Use Item Error:', err);
    res.status(500).json({ message: err.message || 'Server error processing item' });
  }
});

module.exports = router;