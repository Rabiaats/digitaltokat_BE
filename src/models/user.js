"use strict";

const { mongoose } = require('../configs/dbConnection');

const UserSchema = new mongoose.Schema({
    
    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    role: {
        type: String,
        enum: ['firm', 'superadmin'],
        required: true
    },

    resetPassCode: String,

    resetPassExpires: Date

}, {
    collection: 'users',
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);