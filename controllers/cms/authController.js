const bcrypt = require('bcrypt');
const Joi = require('joi');

const AdminModel = require('../../models/tbl_admin')
const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');
const { ADMIN_CONFIG } = require('../../config/constants');

class AuthController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Register as Admin ----------
    * 
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * @param {String} email - Email.
    * @param {String} password - Password.
    * 
    * @return {Object} - Will get Object data after create new admin.
    * 
    * ---------------------------------------- */

    registerAdmin = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required().min(ADMIN_CONFIG.password.min).max(ADMIN_CONFIG.password.max),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                AdminModel.findOne({ email: value.email })
                    .exec()
                    .then((admin) => {
                        if (admin) {
                            return res.status(STATUS.CONFLICT_CODE).json({
                                message: "This email is already registered please use another one."
                            })
                        } else {
                            bcrypt.hash(value.password, ADMIN_CONFIG.saltRounds, function (err, hash) {
                                if (err) {
                                    console.error("🚀 ~ file: authController.js:54 ~ AuthController ~ err:", err)
                                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                        message: err.message
                                    })
                                } else {

                                    let admin = new AdminModel({
                                        ...body,
                                        password: hash
                                    })
                                    admin.save().then((result) => {
                                        return res.status(STATUS.CREATED_CODE).json({
                                            message: "Admin created successfully.",
                                            data: result
                                        })
                                    }).catch((err) => {
                                        console.error("🚀 ~ file: authController.js:71 ~ AuthController ~ admin.save ~ err:", err)
                                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                            message: err.message
                                        })
                                    });
                                }
                            });
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: authController.js:81 ~ AuthController ~ .then ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }

        } catch (err) {
            console.error("🚀 ~ file: authController.js:87 ~ AuthController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new AuthController();