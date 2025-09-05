const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    period: {
      type: String,
      required: true,
      enum: ['weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

budgetSchema.index({ user_id: 1, created_at: -1 });
budgetSchema.index({ user_id: 1, is_active: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
