const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    icon: {
      type: String,
      required: false,
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: false,
      trim: true,
      maxlength: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

categorySchema.index({ user_id: 1, created_at: -1 });
categorySchema.index({ user_id: 1, isActive: 1 });
// Unique index ensures no duplicate category names per user
categorySchema.index({ user_id: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

