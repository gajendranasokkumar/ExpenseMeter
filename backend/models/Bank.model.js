const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
bankSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const bankModel = mongoose.model("banks", bankSchema);

module.exports = bankModel;
