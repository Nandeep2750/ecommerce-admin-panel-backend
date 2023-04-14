const jwt = require('jsonwebtoken')
const { ADMIN_CONFIG } = require('../../config/constants')
const { STATUS } = require('../../config/statuscode')

module.exports = async function (req, res, next) {

    let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['token'];

    if (token) {
        try {
            let decoded = jwt.verify(token, ADMIN_CONFIG.JWT_KEY);
            req.adminData = decoded
            next();
        } catch (err) {
            console.error("🚀 ~ file: admin-auth-check.js:15 ~ err:", err)
            return res.status(STATUS.UNAUTHORIZED_CODE).json({
                message: "Oops! Auth failed."
            })
        }
    } else {
        return res.status(STATUS.UNAUTHORIZED_CODE).json({
            message: "Please enter token."
        })
    }
};