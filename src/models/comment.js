"use strict"


const { mongoose } = require('../configs/dbConnection')

const CommentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    },

    comment: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 100
    },

    rating: {
        type: Number,
        required: true
    },

}, {
    collection: 'comments',
    timestamps: true
})


module.exports = mongoose.model('Comment', CommentSchema)