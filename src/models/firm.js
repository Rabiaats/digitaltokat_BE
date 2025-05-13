"use strict";

const {mongoose} = require('../configs/dbConnection')

const FirmSchema = new mongoose.Schema({

    typeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    domain: {
        type: String,
        default: null,
        trim: true,
        index: true
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

    image: {
        type: [String],
        required: [true, "Görsel alanı zorunludur."],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "En az bir görsel yüklenmelidir.",
        },
    },
    
    visitors: {
        type: []
    },

    countOfVisitors:{
        type: Number,
        get: function (){
            return this.visitors.length;
        }
    },

    rating: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    collection: 'firms',
    timestamps: true,
    toJSON: {getters: true}
});

module.exports = mongoose.model('Firm', FirmSchema)