const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    cost: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['badge', 'theme', 'cosmetic', 'title'],
      default: 'badge',
    },
    // A key the frontend can use to know which icon/asset to render.
    iconKey: { type: String, default: 'default' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
