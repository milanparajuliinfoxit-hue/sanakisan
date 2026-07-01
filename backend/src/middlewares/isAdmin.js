const CustomErrorHandler = require('../utils/CustomErrorHandler')


const isAdmin = (req, res, next) => {
    if (req.user.user_type !== 'admin') {
        return next(CustomErrorHandler.forbidden())
    }
    next()
}

module.exports = isAdmin