"use strict"

const Firm = require('../models/firm');
const User = require('../models/user')
const requestIP = require("request-ip");
const fs = require('node:fs');
const encrypt = require("../helpers/passwordEncrypt");
const passwordCreate = require('../helpers/passwordCreate');

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

        let frontendDomain = "";

        if (req.user?.isStaff) {
            customFilter._id = req.user.firmId;
        } else {
            frontendDomain = req.headers["frontend-domain"];
            console.log("frontendDomain = ", frontendDomain);

            // Domain varsa ve kullanıcı staff değilse, firmayı bul -> firmanin web sayfasi ise
            if (frontendDomain) {
                const firm = await Firm.findOne({ domain: frontendDomain }).select("_id");
                if (firm) {
                    res.status(200).send({
                        error: false,
                        firm
                    })
                } 
            }
        }

        const data = await res.getModelList(Firm, customFilter, [
            { path: 'typeId', select: 'name' }
        ])

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Firm),
            data,
            frontendDomain
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

            req.body.image = [];

            if(req.files){
                for(let file of req.files){
                    req.body.image.push(file.path)
                }
            };


            const data = await Firm.create(req.body)

            const password = passwordCreate(data.email);

            const user = await User.create({firmId: data._id, email: data.email, password, isStaff: true});
    
            res.status(201).send({
                error: false,
                data,
                password
            })
        },
    
        read: async (req, res) => {
            /*
                #swagger.tags = ["Firms"]
                #swagger.summary = "Get Single Firm"
            
                */

            const ip = req.user && !req.user.isStaff && !req.user.isAdmin ? encrypt(requestIP.getClientIp(req)) : null;

            let firmId = req.user?.isStaff ? req.user.firmId : req.params.id

            let frontendDomain = "";
    
            if(!firmId){
                
                frontendDomain = req.headers["frontend-domain"];
                console.log("frontendDomain = ", frontendDomain);

                // Domain varsa ve kullanıcı staff değilse, firmayı bul -> firmanin web sayfasi ise
                if (frontendDomain) {
                    const firm = await Firm.findOne({ domain: frontendDomain }).select("_id");
                    if (firm) {
                        res.status(200).send({
                            error: false,
                            firm
                        })
                    } 
                }else {
                    return res.status(400).send({
                        error: true,
                        message: "Frontend-Domain başlığı gönderilmedi. Lütfen isteği gönderirken headers ile windows.location.hostname i gönderiniz. Ya da params da firma id si gönderiniz.",
                    });
                }
            }

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
                data = await Firm.findOne({ _id: firmId }).populate([
                    { path: 'typeId', select: 'name' },
                    { path: 'categoryId', select: 'name' }
                ]);
            }
    
            res.status(200).send({
                error: false,
                data,
                domain: data.domain,
                frontendDomain
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

           
           let firmId = req.user?.isStaff ? req.user.firmId : req.params.id
           
           if (req.files) {
                for (let file of req.files) {
                    req.body.image.push(file.path);
                }
            }
            
            const firm = await Firm.findOne({_id: firmId});
            
            if(firm && req.files){
                const imagesToDelete = firm.image.filter((deleteImagePath) => !req.body.image.includes(deleteImagePath));
                            
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

            const deleteImage = await Firm.findOne({ _id: req.params.id });
 
            if (deleteImage && deleteImage.image) {
                deleteImage.image.forEach((item) => {
                if (fs.existsSync(item)) {
                fs.unlinkSync(item);
                }
            });
            }
    
            const data = await Firm.deleteOne({ _id: req.params.id})

            await User.deleteOne({firmId: req.params.id});
            
            res.status(data.deletedCount ? 204 : 404).send({
                error: true,
                message: 'Silmek istediğiniz firma önceden silinmiş olabilir.'
            })
    
        },

        requestAccountRemoval: async(req, res) => {
            // Hesap silme isteği -> firma adminleri direk silemesin sadece superadmin

            if (req.user?.isStaff) req.params.id = req.user.firmId;

            const data = await Firm.updateOne({ _id: req.params.id},{isActive: false}, {runValidators: true})

            res.status(202).send({
                error: false,
                message: 'Silme isteğiniz iletildi'
            })
        }

}