const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

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
                password: Joi.string().required().min(ADMIN_CONFIG.PASSWORD.MIN).max(ADMIN_CONFIG.PASSWORD.MAX),
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
                            bcrypt.hash(value.password, ADMIN_CONFIG.SALT_ROUNDS, function (err, hash) {
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

    /** ---------- Login as Admin  ----------
    * 
    * @param {String} email - Email.
    * @param {String} password - Password.
    * 
    * @return {Object} - It's use for login as Admin and give us admin data with token.
    * 
    * ---------------------------------------- */

    loginAdmin = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                email: Joi.string().required().email(),
                password: Joi.string().required()
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                let filter = { email: value.email };
                let update = {
                    refreshToken: uuidv4(),
                    refreshTokenCreatedAt: moment().valueOf()
                };

                AdminModel.findOneAndUpdate(filter, update, { new: true })
                    .select(["firstName", "lastName", "email", "password", "refreshToken"])
                    .exec()
                    .then((admin) => {
                        if (admin) {
                            bcrypt.compare(value.password, admin.password, async (err, isMatch) => {
                                if (err) {
                                    console.error("🚀 ~ file: authController.js:133 ~ AuthController ~ bcrypt.compare ~ err:", err)
                                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                        message: "Something went wrong."
                                    })
                                } else if (isMatch) {

                                    let token = jwt.sign({
                                        adminId: admin._id
                                    }, ADMIN_CONFIG.JWT_KEY, {
                                        expiresIn: ADMIN_CONFIG.TOKEN_EXPIRES_IN,
                                    })

                                    admin = JSON.parse(JSON.stringify(admin));
                                    admin.token = token
                                    delete admin.password

                                    return res.status(STATUS.SUCCESS_CODE).json({
                                        message: "Admin logged in successfully.",
                                        data: admin
                                    })
                                } else {
                                    return res.status(STATUS.FORBIDDEN_CODE).json({
                                        message: "Authentication failed. Please check your credentials."
                                    })
                                }
                            })
                        } else {
                            return res.status(STATUS.FORBIDDEN_CODE).json({
                                message: "Authentication failed. Please check your credentials."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: authController.js:165 ~ AuthController ~ .then ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.error("🚀 ~ file: authController.js:172 ~ AuthController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new AuthController();