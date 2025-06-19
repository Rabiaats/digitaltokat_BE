"use strict";

const {mongoose} = require('../configs/dbConnection')

const ProductSchema = new mongoose.Schema({

    firmId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    image:{
        type:String,
        required: [true, "Görsel alanı zorunludur."],
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: "Bir görsel yüklenmelidir.",
        },
    },
    
    price: {
        type: Number,
    }

}, {
    collection: 'products',
    timestamps: true
})


module.exports = mongoose.model('Product', ProductSchema)