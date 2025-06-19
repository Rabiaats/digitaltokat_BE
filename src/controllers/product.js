"use strict"

const Product = require('../models/product');
const {CustomError} = require('../errors/customError')
const fs = require('node:fs');
const requestIP = require("request-ip");
const encrypt = require("../helpers/passwordEncrypt");
const { match } = require('node:assert');
const Firm = require('../models/firm');
const { error } = require('node:console');

module.exports = {

    list: async(req, res) => {

        /*
            #swagger.tags = ["Products"]
            #swagger.summary = "List Products"
            #swagger.description = `
                Ürün listeleme firma id si ya da firmanin web sayfasına ait domain e göre yapılır
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

        
        let frontendDomain = "";
        // firm admin i sayfasi ise
        if(req.user?.isStaff){
            customFilter = {firmId: req.user.firmId};
        } 
        //params
        else if( req.params.id){
            customFilter = {firmId: req.params.id}
        }
        // frontend-domain
        else{
            frontendDomain = req.headers["frontend-domain"];
            console.log("frontendDomain = ", frontendDomain);

            if (frontendDomain) {
                const firm = await Firm.findOne({ domain: frontendDomain }).select("_id");
                if (firm) {
                    customFilter = {firmId: firm._id}
                }else {
                    res.status(404).send({
                        error: true,
                        message: "Görüntülemek istediğiniz ürünlerin firmasi bulunamadi. Frontend-Domain i doğru gönderdiğinizden emin olun."
                    })
                }
            }
        }
        

        if(!customFilter.firmId){
            res.status(404).send({
                error: true,
                message: 'Firma id sini göndermemiz gerekmektedir'
            })
        }

        const data = await res.getModelList(Product, customFilter, [
            {path: 'firmId', select: 'name -_id'},
        ])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Product),
            data,
            frontendDomain
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

        // firm admin i sayfasi ise kendi firmId sini body den gelen firmId ye esitleriz
        if (req.user?.isStaff){
            req.body.firmId = req.user.firmId
        }
        
        const frontendDomain = req.headers["Frontend-Domain"]

        const firm = await Firm.findOne({ domain: frontendDomain }).select("_id");
        if (firm) {
            req.body.firmId = firm._id
        }

        req.body.image = "";

        if(req.file){
            req.body.image = req.file.path
        };

        const data = await Product.create(req.body)
    
        res.status(201).send({
            error: false,
            data,
            frontendDomain
        })
    },
    
        read: async (req, res) => {
            /*
                #swagger.tags = ["Products"]
                #swagger.summary = "Get Single Product"
            */
    
            const data = await Product.findOne(
                { _id: req.params.id },
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

            let customFilter = "";

            if(req.user?.isStaff){
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

            let customFilter = "";

            if(req.user?.isStaff){
                customFilter = {firmId: req.user.firmId}
            }
            
    
            const data = await Product.findOne({ _id: req.params.id, ...customFilter})

            if(!data){
                throw new CustomError('Silmek istediğiniz ürün bulunamadı ya da başka bir firmanın ürününü silmeye çalışıyorsunuz. Firma ve ürün bilgilerini kontrol ediniz')
            }

            const deleteImage = await Product.findOne({ _id: req.params.id });
             
            if (deleteImage && deleteImage.image) {
                if (fs.existsSync(`${deleteImage.image}`)) {
                    fs.unlinkSync(`${deleteImage.image}`);
                }
            }

            await Product.deleteOne({_id : req.params.id, ...customFilter})
    
            res.status(data.deletedCount ? 204 : 404).send({
                error: true,
                message: 'Something went wrong, data might be deleted already.'

            })
    
        },
}