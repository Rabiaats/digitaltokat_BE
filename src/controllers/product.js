"use strict"

const Product = require('../models/product');
const {CustomError} = require('../errors/customError')
const fs = require('node:fs');
const requestIP = require("request-ip");
const encrypt = require("../helpers/passwordEncrypt");
const { match } = require('node:assert');

module.exports = {

    list: async(req, res) => {

        /*
            #swagger.tags = ["Products"]
            #swagger.summary = "List Products"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value1</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[fielSd1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        let customFilter = {};
        let domainFilter = ""

        // firm admin i sayfasi ise
        if (req.user?.role == 'firm') customFilter = {firmId: req.firm};

        const requestDomain = req.get('host');

        // isyeri domaini ise
        if (requestDomain !== 'www.tokatdigital.com') {
            domainFilter = requestDomain;
        }else{
            domainFilter = `/details/${req.params.id}`
        }


        const data = await res.getModelList(Product, customFilter, [
            {path: 'firmId', select: 'name -_id', match: {domain: domainFilter}},
        ])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Product),
            data            
        })
    },

     create: async (req, res) => {
        /*
            #swagger.tags = ["Products"]
            #swagger.summary = "Create Product"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref:"#/definitions/Product"
                }
            }
        */

        if(req.user && req.user.role == 'firm' && req.body.firmId != req.firm){
            res.status(403).send({
                error: true,
                message: 'Yanlış firmaya ürün eklemeye çalışıyorsunuz.'
            })
        }

        req.body.image = "";

        if(req.file){
            req.body.image = req.file.path
        };

        const data = await Product.create(req.body)
    
        res.status(201).send({
            error: false,
            data
        })
    },
    
        read: async (req, res) => {
            /*
                #swagger.tags = ["Products"]
                #swagger.summary = "Get Single Product"
            */

        
            let customFilter = {};

            if(req.user && req.user.role == 'firm'){
                customFilter = {firmId: req.user.firmId}
            }
    
            const data = await Product.findOne(
                { _id: req.params.id, ...customFilter },
            ).populate([
                {path: 'categoryId', select: 'name -_id'},
                {path: 'firmId', select: 'name -_id'},
            ])
    
            res.status(200).send({
                error: false,
                data
            })
    
        },
    
        update: async (req, res) => {
            /*
                #swagger.tags = ["Products"]
                #swagger.summary = "Update Product"
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        $ref:"#/definitions/Product"
                    }
                }
            */

        req.body.image = "";

            if (req.file) {
                req.body.image = req.file.path;
            }

            if(req.user && req.user.role == 'firm'){
                customFilter = {firmId: req.user.firmId}
            }
            
            const product = await Product.findOne({_id: req.params.id, ...customFilter});
            
            if(product && product.image){
                if (fs.existsSync(`${deleteImage.image}`)) {
                    fs.unlinkSync(`${deleteImage.image}`);
                }
            }else{
                throw new CustomError("Güncellemek istediğiniz ürün firmanızda bulunmamaktadır")
            }

            const data = await Product.updateOne({ _id: req.params.id, ...customFilter }, req.body, { runValidators: true })
    
            res.status(202).send({
                error: false,
                data,
                new: await Product.findOne({ _id: req.params.id })
            })
    
        },
    
        deletee: async (req, res) => {
            /*
                #swagger.tags = ["Products"]
                #swagger.summary = "Delete Product"
            */

            if(req.user && req.user.role == 'firm'){
                req.params.id = req.user.firmId
            }
    
            const data = await Product.findOne({ _id: req.params.id})

            if(!data){
                throw new CustomError('This product could not be found')
            }

            const deleteImage = await Product.findOne({ _id: req.params.id });
             
            if (deleteImage && deleteImage.image) {
                if (fs.existsSync(`${deleteImage.image}`)) {
                    fs.unlinkSync(`${deleteImage.image}`);
                }
            }

            await Product.deleteOne({_id : req.params.id})
    
            res.status(data.deletedCount ? 204 : 404).send({
                error: true,
                message: 'Something went wrong, data might be deleted already.'

            })
    
        },
}