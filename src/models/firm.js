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

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],

    advantages:{
            type: String,
            default: ''
    },
    
    rating: {
        type: Number,
        default: 0
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

    isActive: {
        type: Boolean,
        default: true
    },

    isOpen: {
        type: Boolean,
        default: true
    }

}, {
    collection: 'firms',
    timestamps: true,
    toJSON: {getters: true}
});

FirmSchema.statics.commentRating = async function (firmId) {

  const firm = await this.findById(firmId).populate('comments');

  if (!firm || firm.comments.length === 0) {
    firm.rating = 0;
  } else {
    const total = firm.comments.reduce((sum, comment) => sum + comment.rating, 0);
    firm.rating = total / firm.comments.length;
  }

  await firm.save();
  return firm;
};


module.exports = mongoose.model('Firm', FirmSchema)