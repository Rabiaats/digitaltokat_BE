"use strict";

const {mongoose} = require('../configs/dbConnection')

const FirmSchema = new mongoose.Schema({

    typeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    
    categoryId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],

    name: {
        type: String,
        required: true,
        trim: true
    },

    domain: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    whatsapp: {
        type: String,
        required: true,
        trim: true
    },

    images: {
        type: [String],
        required: [true, "Görsel alanı zorunludur."],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "En az bir görsel yüklenmelidir.",
        },
    },
    
    color: {
        type: String,
        required: true,
        trim: true
    },
    
    visitors: {
        type: []
    },

    rating: {
        type: Number,
        default: 0,
    }

}, {
    collection: 'firms',
    timestamps: true
})


module.exports = mongoose.model('Firm', FİrmSchema)