"use strict"

const Firm = require('../models/firm');
const requestIP = require("request-ip");
const fs = require('node:fs');
const encrypt = require("../helpers/passwordEncrypt");

module.exports = {

    list: async(req, res) => {

        /*
            #swagger.tags = ["Firms"]
            #swagger.summary = "List Firms"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        let customFilter = {};

        if (req.user?.role == 'firm') customFilter = {_id: req.firm};

        const requestDomain = req.get('host');

        if (requestDomain !== 'www.tokatdigital.com' || requestDomain !== 'localhost:8000') {
            customFilter.domain = requestDomain;
        }

        const data = await res.getModelList(Firm, customFilter, [
            {path: 'typeId', select: 'name'},
            {path: 'categoryId', select: 'name'}
        ])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Firm),
            data            
        })
    },

     create: async (req, res) => {
        /*
            #swagger.tags = ["Firms"]
            #swagger.summary = "Create Firm"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                $ref"#/definitions/Firm"
                    }
                }
            */

                req.body.images = [];

        if(req.files){
            for(let file of req.files){
                req.body.images.push(file.path)
                }
            };


            const data = await Firm.create(req.body)
    
            res.status(201).send({
                error: false,
                data
            })
        },
    
        read: async (req, res) => {
            /*
                #swagger.tags = ["Firms"]
                #swagger.summary = "Get Single Firm"
            
                */

            const ip = !req.user ? encrypt(requestIP.getClientIp(req)) : null;


            let firmId = req.user?.role == 'firm' ? req.user.firmId : req.params.id
    
            let data;

            if (ip) {
                data = await Firm.findOneAndUpdate(
                    { _id: firmId},
                    { $addToSet: { visitors: ip } },
                    { new: true }
                ).populate([
                    { path: 'typeId', select: 'name' },
                    { path: 'categoryId', select: 'name' }
                ]);
            } else {
                data = await Firm.findOne({ _id: req.params.id }).populate([
                    { path: 'typeId', select: 'name' },
                    { path: 'categoryId', select: 'name' }
                ]);
            }
    
            res.status(200).send({
                error: false,
                data
            })
    
        },
    
        update: async (req, res) => {
            /*
                #swagger.tags = ["Firms"]
                #swagger.summary = "Update Firm"
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                    $ref"#/definitions/Firm"
                    }
                }
            */

                if ((req.user.role == 'firm') && req.params.id != req.user.firmId){

                res.status(403).send({
                    error: true,
                    message: 'Sadece kendinize ait firmayı güncelleme izniniz var.'
                })

            }

            let firmId = req.user.role == 'firm' ? req.user.firmId : req.params.id

            if (req.files) {
                for (let file of req.files) {
                    req.body.image.push(file.path);
                }
            }
            
            const firm = await Firm.findOne({_id: firmId});
            
            if(firm){
                const imagesToDelete = firm.images.filter((deleteImagePath) => !req.body.image.includes(deleteImagePath));
                            
                imagesToDelete.forEach((imagePath) => {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            const data = await Firm.updateOne({_id: firmId}, req.body, { runValidators: true })
    
            res.status(202).send({
                error: false,
                data,
                new: await Firm.findOne({ _id: req.params.id })
            })
    
        },
    
        deletee: async (req, res) => {
            /*
                #swagger.tags = ["Firms"]
                #swagger.summary = "Delete Firm"
            */
           
           if ((req.user.role == 'firm') && req.params.id != req.user.firmId){
               
               res.status(403).send({
                   error: true,
                   message: 'Sadece kendinize ait firmayı silme izniniz var.'
                })
                
            }

            const deleteImage = await Firm.findOne({ _id: req.params.id });
 
    if (deleteImage && deleteImage.images) {
        deleteImage.images.forEach((item) => {
        if (fs.existsSync(item)) {
          fs.unlinkSync(item);
        }
      });
    }
    
            const data = await Firm.deleteOne({ _id: req.params.id})
    
            res.status(data.deletedCount ? 204 : 404).send({
                error: true,
                message: 'Silmek istediğiniz firma önceden silinmiş olabilir.'

            })
    
        },
}