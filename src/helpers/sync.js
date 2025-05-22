"use strict"

const passwordCreate = require('../helpers/passwordCreate');

module.exports = async function () {

    // return null;

/* User */
    const User = require('../models/user')
    await User.deleteMany() // !!! Clear collection.
    await User.create({
        "_id": "682311ce1cdb392355c7ee3b",
        "email": "dijitaladmin@gmail.com",
        "password": "D*Admin123",
        "isAdmin": true
        })
        await User.create({
            "_id": "682312451cdb392355c7ee3f",
            "email": "user1@gmail.com",
            "password": "User1*123*",
            "firstName": "Ali",
            "lastName": "Altin",
            })
            
            /* Category */
            const Category = require('../models/category')
            await Category.deleteMany() // Clear collection
            await Category.create(
                {
                    "_id": "68230095c71da2d91dcdb39b",
                    "name": "Meyve-Sebze"
                })
            await Category.create(
                {
                    "_id": "682300a1c71da2d91dcdb39d",
                    "name": "Et Ürünleri"
            })
            await Category.create(
                {
                    "_id": "682300a7c71da2d91dcdb39f",
                    "name": "Süt Ürünleri"
            })
            await Category.create(
                {
                    "_id": "682300b1c71da2d91dcdb3a1",
                    "name": "Bakliyat"
            })
            await Category.create(
                {
                    "_id": "682300e3c71da2d91dcdb3a3",
                    "name": "Temizlik"
            })
            await Category.create(
                {
                    "_id": "682300fac71da2d91dcdb3a5",
                    "name": "Kadın"
            })
            await Category.create(
                {
                    "_id": "68230101c71da2d91dcdb3a7",
                    "name": "Erkek"
            })
            
            
            /* Types */
            const Type = require('../models/type')
            await Type.deleteMany() // Clear collection
            await Type.create(
                {
                    "_id": "6822fe3326e72a29b474a9bd",
                    "name": "Terzi",
            })
            await Type.create(
                {
                    "_id": "6822ff456cc94a3585d9a2ef",
                    "name": "Kasap"
            })
            await Type.create(
                {
                    "_id": "6822ff4c6cc94a3585d9a2f1",
                    "name": "Manav"
            })
            await Type.create(
                {
                    "_id": "6822ff526cc94a3585d9a2f3",
                    "name": "Fırın"
            })
            await Type.create(
                {
                    "_id": "6822ff896cc94a3585d9a2f5",
                    "name": "Süt Ürünleri"
            })
            await Type.create(
                {
                    "_id": "6822ff966cc94a3585d9a2f7",
                    "name": "Market"
            })
            await Type.create({
                        "_id": "68230637711490def36ecc56",
                        "name": "Temizlik"
                    })


            /* Firms */
            const Firm = require('../models/firm')
    await Firm.deleteMany() // !!! Clear collection.
    let data = await Firm.create({
        "_id": "68230e21ac38f9d72995f130",
        "typeId": "6822fe3326e72a29b474a9bd",
        "name": "Ali Terzi",
        "domain": "www.aliterzi.com",
        "description": "Her türlü dikim yapılır",
        "address": "www.aliterzi.com",
        "email": "aliterzi@gmail.com",
        "phone": "0356XXXXXXT",
        "whatsapp": "0356XXXXXXT",
        "image": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/AliTerzi_Logo.jpg/800px-AliTerzi_Logo.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/AliTerzi.jpg/800px-AliTerzi.jpg"
        ]
        })

        let password = passwordCreate(data.email);
        let user = await User.create({firmId: data._id, email: data.email, password, isStaff: true});
        // aliterzi@gmail.com  Aliterzi**81477

    data = await Firm.create({
        "_id": "682310a369918a0936b225ab",
        "typeId": "6822ff4c6cc94a3585d9a2f1",
        "name": "Tokat Manav",
        "domain": "",
        "description": "Her türlü dikim yapılır",
        "address": "www.tokatmanav.com",
        "email": "tokatmanav@gmail.com",
        "phone": "0356XXXXXXM",
        "whatsapp": "0356XXXXXXM",
        "image": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/TokatManav_Logo.jpg/800px-TokatManav_Logo.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/TokatManav.jpg/800px-TokatManav.jpg"
        ]
    })
    
        password = passwordCreate(data.email);
        user = await User.create({firmId: data._id, email: data.email, password, isStaff: true});
        console.log(user.email + "  " + password)
        // tokatmanav@gmail.com  Tokatmanav**61831


/* Product */
const Product = require('../models/product')
    await Product.deleteMany() // !!! Clear collection.
    await Product.create()
    await Product.create()

/* Finished */
console.log('* Synchronized')
}