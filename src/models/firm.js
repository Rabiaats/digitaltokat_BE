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
        trim: true,
        unique: true,
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

    countOfVisitors:{
        type: Number,
        get: function (){
            return this.visitors.length;
        }
    },

    rating: {
        type: Number,
        default: 0,
    }

}, {
    collection: 'firms',
    timestamps: true,
    toJSON: {getters: true}
});

FirmSchema.pre('save', function (next) {
    if (!this.domain || this.domain.trim() === '') {
      this.domain = `/details/${this._id}`;
    }
    next();
});

// // domain yoksa yönlendir
// if (firm.domain == `/details/${firm._id}`) {
//     return res.redirect(`https://www.tokatdigital.com${domain}`);
//   }else { return res.redirect(domain)}

//   // domain varsa normal şekilde gönder
//   res.status(200).send({
//     error: false,
//     data: firm
//   });
  

module.exports = mongoose.model('Firm', FirmSchema)