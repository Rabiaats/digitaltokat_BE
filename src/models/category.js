"use strict";

const {mongoose} = require('../configs/dbConnection')

const CategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    }

}, {
    collection: 'categories',
    timestamps: true
})


module.exports = mongoose.model('Category', CategorySchema)