"use strict"
/* -------------------------------------------------------
| FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const passwordEncrypt = require('../helpers/passwordEncrypt');
const sendMail = require('../helpers/sendMail')
const token = require('../models/token');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {

    list: async (req, res) => {
        /* 
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(User)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(User),
            data
        })
    },

    // CRUD:
    create: async (req, res) => {
        /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Create User'
        #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/User'
                }
            }
    */

        const data = await User.create(req.body);

    
        sendMail(
            data.email,
            'Wellcome to E Commerce',
            `
                <h1>Welcome</h1>
                <h2>${data.username}</h2>
            `
            )

        res.status(201).send({
            error: false,
            data
        })
    },

    read: async (req, res) => {
        /* 
           #swagger.tags = ["Users"]
           #swagger.summary = "Get Single User"
           
        */

        if (!req.user.isAdmin) req.params.id = req.user._id;

        const data = await User.findOne({ _id: req.params.id });

        res.status(200).send({
            error: false,
            data
        })
    },

    update: async (req, res) => {
        /*
        #swagger.tags = ['Users']
        #swagger.summary = 'Update User'
        #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/User'
                }
            }
    */

        if (!req.user.isAdmin) req.params.id = req.user._id;

        const data = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true });


        res.status(202).send({
            error: false,
            data,
            new: await User.findOne({ _id: req.params.id })
        })
    },

    deletee: async (req, res) => {
        /* 
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete Single User"
        */

        if (!req.user.isAdmin) req.params.id = req.user._id;

        const data = await User.deleteOne({ _id: req.params.id });

        res.status(data.deletedCount ? 204 : 404).send({
            error: true,
            message: 'Kullanıcı önceden silinmiş olabilir.'
        })
    },

    forgotPassword: async(req, res) => {

        /* 
            #swagger.tags = ["Users"]
            #swagger.summary = "Forgot Password"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "email": "test@site.com"
                }
            }
        */

        const { email } = req.body
            
            const verifyCode = Math.floor(100000 + + Math.random() * 900000).toString();

            const user = await User.findOneAndUpdate(
                {email: email},
                {
                    resetPassCode: verifyCode,
                    resetPassExpires: Date.now() + 600000 // 10 m
                },
                {new: true}
            )


            if(!user){
                
                res.status(404).send({
                    error: true,
                    message: 'Bu email de bir kullanıcı yok!'
                })
            }

            await sendMail(
                email,
                'Şifre Sıfırlama',
                `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Merhaba,</h2>
                    <p>Şifrenizi sıfırlamak istediniz. Lütfen aşağıdaki kodu kullanın:</p>
                    <div style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; width: fit-content;">
                        ${verifyCode}
                    </div>
                    <p>Bu kodun süresi 10 dakika içinde sona erecek.</p>
                    <p>Bunu isteği göndermediysen, lütfen bu e-postayı dikkate almayın.</p>
                    </div>
                `
                )

            res.status(200).send({
                error: false,
                message: 'Şifre sıfırlama kodu gönderildi'
              });
    },

    changePassword: async(req, res) => {

        /* 
            #swagger.tags = ["Users"]
            #swagger.summary = "Forgot Password"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "email": "test@site.com"
                    "newPass": "1234"
                }
            }
        */

        const { email, newPass } = req.body

        const user = await User.updateOne(
            {email: email}, 
            {password: newPass},
            {runValidators:true}
        );

        if(user.matchedCount == 0){
            res.status(404).send({
                error: true,
                message: 'BU email de bir kulanıcı yok!'
            })
        }

        if (data.modifiedCount === 0) {
            return res.status(202).send({ 
                error: false, 
                message: 'Değişiklik yapılmadı. Şifreniz önceki şifrenizle aynı olabilir.' 
            });
        }

        res.status(202).send({ 
            error:false, 
            message: 'Şifreniz güncellendi.' 
        });
    }

}