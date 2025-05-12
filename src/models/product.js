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

    images:[
        {
            type:String,
            required: true,
            trim: true
        }
    ],
    
    price: {
        type: Number,
        required: true,
    }

}, {
    collection: 'products',
    timestamps: true
})


module.exports = mongoose.model('Product', ProductSchema)