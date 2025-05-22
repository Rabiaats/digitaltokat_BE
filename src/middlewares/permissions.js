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

    isAdmin: (req, res, next) => {

        // Set Passive:
        // return next()
        
        // only Admin:
        if (req.user && req.user.isAdmin) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('Bu işlemi yapmak için izniniz bulunmamaktadır. Tokat Dijital olarak giriş yapmanız gerekmektedir.')
        }
    },

    isStaffOrAdmin: (req, res, next) => {

        // return next()

        if(req.user && (req.user.isAdmin || req.user.isStaff)){
            next();
        }else{
            res.errorStatusCode = 403;
            throw new Error('Bu işlemi yapmak için izniniz bulunmamaktadır. Tokat Dijital ya da Fİrma Admin\'i olarak giriş yapmanız gerekmektedir.')
        }
    },

     isStaff: (req, res, next) => {

        // return next()
        
        if (req.user?.isStaff) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('Bu işlemi yapmak için yetkili değilsiniz.')
        }
    },
}