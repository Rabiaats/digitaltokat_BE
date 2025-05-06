"use strict"

// app.use(authentication):

const jwt = require('jsonwebtoken')
const Token = require('../models/token')

module.exports = async (req, res, next) => {

    const auth = req.headers?.authorization || null // Token ...tokenKey... // Bearer ...accessToken...
    const tokenKey = auth ? auth.split(' ') : null // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

    if (tokenKey) {

        if (tokenKey[0] == 'Token') { // SimpleToken

            const tokenData = await Token.findOne({ token: tokenKey[1] }).populate('userId')
            req.user = tokenData ? tokenData.userId : undefined

        } else if (tokenKey[0] == 'Bearer') { // JWT

            jwt.verify(tokenKey[1], process.env.ACCESS_KEY, (err, userData) => {
                if(userData){
                    req.user = userData
                }else{
                    return res.status(401).send({ error: true, message: 'Geçersiz token.' })
                }
            })
        }

        if(req.user && req.user.role == 'firm'){
            req.firm = req.user.firmId
        }
    }

    next()
}