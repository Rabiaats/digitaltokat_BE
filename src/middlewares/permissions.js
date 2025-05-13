"use strict"

module.exports = {

    isLogin: (req, res, next) => {

        // Set Passive:
        // return next()

        // any User:
        if (req.user) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('Bu işlemi yapmak için giriş yapmanız gerekmektedir.')
        }
    },

    isSuperAdmin: (req, res, next) => {

        // Set Passive:
        // return next()
        
        // only Admin:
        if (req.user && req.user.role == 'superadmin') {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('Bu işlemi yapmak için izniniz bulunmamaktadır. Tokat Dijital olarak giriş yapmanız gerekmektedir.')
        }
    },

    isFirmOrSuperAdmin: (req, res, next) => {

        // return next()


        if(req.user && (req.user.role == 'firm' || req.user.role == 'superadmin')){
            next();
        }else{
            res.errorStatusCode = 403;
            throw new Error('Bu işlemi yapmak için izniniz bulunmamaktadır. Tokat Dijital ya da Fİrma Admin\'i olarak giriş yapmanız gerekmektedir.')
        }
    },
}