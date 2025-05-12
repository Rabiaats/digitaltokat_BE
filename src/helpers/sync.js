"use strict"
// sync():

module.exports = async function () {

    // return null;

    /* REMOVE DATABASE *
    const { mongoose } = require('../configs/dbConnection')
    await mongoose.connection.dropDatabase()
    console.log('- Database and all data DELETED!')
    /* REMOVE DATABASE */

    /* User *
    const User = require('../models/user')
    await User.deleteMany() // !!! Clear collection.
    await User.create({
        "email": "admin@site.com",
        "password": "Admin123*dt"
    })

    /* Firms *
    const Firm = require('../models/firm')
    await Firm.deleteMany() // !!! Clear collection.
    await Firm.create({
        "_id": "65343222b67e9681f937f104",
        "name": "Adidas",
        "image": "https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo-1991.jpg"
    })

    /* Category *
    const Category = require('../models/category')
    await Category.deleteMany() // !!! Clear collection.
    await Category.create({
        "_id": "65343222b67e9681f937f201",
        "name": "Food",
    })

    /* Firm *
    const Firm = require('../models/firm')
    await Firm.deleteMany() // !!! Clear collection.
    await Firm.create({
        "_id": "65343222b67e9681f937f335",
        "name": "Çetinkaya",
        "phone": "0212 444 00 55",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1Mug9ruTOC1x8LGeNAr-ouWrWm29Z6u91QMU8ZfE&s",
        "address": "B01-Z02 Maslak Büyükdere Cad. Uso Center 245/A, 34396 Sarıyer/İstanbul, Türkiye"
    })

    /* Product *
    const Product = require('../models/product')
    await Product.deleteMany() // !!! Clear collection.
    await Product.create({
        "_id": "65343222b67e9681f937f421",
        "name": "Tommy",
        "categoryId": "65343222b67e9681f937f203",
        "brandId": "65343222b67e9681f937f107",
        "quantity": 0
    })

    /* Purchase *
    const Purchase = require('../models/purchase')
    await Purchase.deleteMany() // !!! Clear collection.
    await Purchase.create({
        "_id": "65343222b67e9681f937f513",
        "userId": "65343222b67e9681f937f001",
        "firmId": "65343222b67e9681f937f304",
        "brandId": "65343222b67e9681f937f123",
        "productId": "65343222b67e9681f937f422",
        "quantity": 1000,
        "price": 20
    })

    /* Sale *
    const Sale = require('../models/sale')
    await Sale.deleteMany() // !!! Clear collection.
    await Sale.create({
        "_id": "65343222b67e9681f937f614",
        "userId": "65343222b67e9681f937f001",
        "brandId": "65343222b67e9681f937f123",
        "productId": "65343222b67e9681f937f422",
        "quantity": 100,
        "price": 30
    })

    /* Finished */
    console.log('* Synchronized.')
}