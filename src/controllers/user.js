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

        /* Auth Login */
        // Simple Token:
        const tokendata = await token.create({
            userId: data._id,
            token: passwordEncrypt(data._id + Date.now())
        })

        // JWT:
        const accessToken = jwt.sign(data.toJSON(), process.env.ACCESS_KEY, { expiresIn: process.env.ACCESS_EXP })
        const refreshToken = jwt.sign({ _id: data._id, password: data.password }, process.env.REFRESH_KEY, { expiresIn: process.env.REFRESH_EXP })

        res.status(201).send({
            error: false,
            token: tokendata.token,
            bearer: { accessToken, refreshToken },
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
            message: 'Something went wrong, data might be deleted already.'
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
                    message: 'User not exist with this email!'
                })
            }

            await sendMail(
                email,
                'Reset Your Password',
                `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Hello,</h2>
                    <p>You requested to reset your password. Please use the code below:</p>
                    <div style="font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; width: fit-content;">
                        ${verifyCode}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `
                )

            res.status(200).send({
                success: true,
                message: 'Reset code sent!'
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
                message: 'User not exist with this email!'
            })
        }

        if (data.modifiedCount === 0) {
            return res.status(202).send({ 
                error: false, 
                message: 'No changes made. Same password maybe?' 
            });
        }

        res.status(202).send({ 
            error:false, 
            message: 'Password updated successfully.' 
        });
    }

}