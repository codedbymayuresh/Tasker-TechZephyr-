const Item = require('../models/Item');
const { formatUser } = require('./authController');

// @route GET /api/shop
// Public list of everything purchasable. Doesn't need auth, but the
// route is still protected so the frontend can show "owned" state -
// keeping it simple by always requiring login here.
const getItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort('cost');
    res.json({ items });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/shop/purchase/:itemId
const purchaseItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const alreadyOwned = req.user.inventory.some(
      (ownedId) => ownedId.toString() === item._id.toString()
    );
    if (alreadyOwned) {
      return res.status(400).json({ message: 'You already own this item' });
    }

    if (req.user.gold < item.cost) {
      return res.status(400).json({ message: 'Not enough gold to purchase this item' });
    }

    req.user.gold -= item.cost;
    req.user.inventory.push(item._id);
    await req.user.save();

    res.json({
      message: `Purchased ${item.name}`,
      item,
      user: formatUser(req.user),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getItems, purchaseItem };
