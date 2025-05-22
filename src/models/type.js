"use strict";

const {mongoose} = require('../configs/dbConnection')

const TypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    }

}, {
    collection: 'types',
    timestamps: true
})


module.exports = mongoose.models.Type || mongoose.model('Type', TypeSchema);