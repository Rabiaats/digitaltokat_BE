"use strict";

const { mongoose } = require('../configs/dbConnection');
const passwordEncrypt = require('../helpers/passwordEncrypt');

const UserSchema = new mongoose.Schema({
    
    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        validate: {
            validator: function (value) {
                // isStaff true ise firmId gerekli
                if (this.isStaff && !value) return false;
                return true;
            },
            message: 'Satıcının ait olduğu firmanın bilgisi için firma id si girilmesi zorunludur. '
        }
    },

    favoritesId: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Firm'
            }
        ],
        default: []
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

    firstName: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                if (this.isStaff || this.isAdmin) return true;
                return !!value;
            },
        }
    },

    lastName: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                if (this.isStaff || this.isAdmin) return true;
                return !!value;
            },
        }
    },

    age: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        trim: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isStaff:{
        type: Boolean,
        default: false
    },

    isBloked: {
        type: Boolean,
        default: false
    },

    resetPassCode: String,

    resetPassExpires: Date

}, {
    collection: 'users',
    timestamps: true
});

UserSchema.pre(['save', 'updateOne'], function (next) {

    // updateOne: _update, save: this
    const data = this?._update ?? this

    // Email Validation:
    const isEmailValidated = data.email ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) : true

    if (!isEmailValidated) {
        // throw new Error('Email is not validated');
        next(new Error('Email is not validated'));
    }

    const isPasswordValidated = data.password ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/.test(data.password) : true

    if (!isPasswordValidated) next(new Error('Password must be at least 8 characters long and contain at least one special character and  at least one uppercase character.'));

    if (data.password) data.password = passwordEncrypt(data.password)

    next();

});


module.exports = mongoose.model('User', UserSchema);