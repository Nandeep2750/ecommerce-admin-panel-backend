const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const bcrypt = require('bcrypt');

const { CmsController } = require('./cmsController');
const AdminModel = require('../../models/tbl_admin');
const { STATUS } = require('../../config/statuscode');
const { ADMIN_CONFIG } = require('../../config/constants');

class AdminController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Change Password  ----------
    * 
    * @param {String} currentPassword - Current Password.
    * @param {String} newPassword - New Password.
    * 
    * @return {Object} - It will return success object message.
    * 
    * ---------------------------------------- */

    changePassword = (req, res, next) => {

        try {

            let { adminData } = req
            let { body } = req;

            const validationSchema = Joi.object({
                currentPassword: Joi.string().required(),
                newPassword: Joi.string().required().min(ADMIN_CONFIG.PASSWORD.MIN).max(ADMIN_CONFIG.PASSWORD.MAX),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                if (value.currentPassword == value.newPassword) {
                    return res.status(STATUS.CONFLICT_CODE).json({
                        message: "You cann't use your current password as your new password.",
                    });
                }

                AdminModel.findById(adminData.adminId)
                    .select(["password"])
                    .exec().then((admin) => {
                        if (admin) {
                            bcrypt.compare(value.currentPassword, admin.password, async (err, isMatch) => {

                                if (err) {
                                    console.error("🚀 ~ file: adminController.js:57 ~ AdminController ~ bcrypt.compare ~ err:", err)

                                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                        message: "Something went wrong."
                                    })

                                } else if (isMatch) {

                                    bcrypt.hash(value.newPassword, ADMIN_CONFIG.SALT_ROUNDS, function (err, hash) {
                                        if (err) {
                                            console.error("🚀 ~ file: adminController.js:67 ~ AdminController ~ err:", err)

                                            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                                message: err.message
                                            })

                                        } else {

                                            AdminModel.findByIdAndUpdate(adminData.adminId, {
                                                password: hash
                                            }, { new: true })
                                                .select(["firstName", "lastName", "email", "type", "refreshToken"])
                                                .exec().then((result) => {
                                                    if (result) {
                                                        return res.status(STATUS.SUCCESS_CODE).json({
                                                            message: "Password changed successfully.",
                                                        })
                                                    } else {
                                                        return res.status(STATUS.NOT_FOUND_CODE).json({
                                                            message: "No admin available for given admin id."
                                                        })
                                                    }
                                                }).catch((err) => {
                                                    console.error("🚀 ~ file: adminController.js:91 ~ AdminController ~ .exec ~ err:", err)
                                                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                                        message: err.message
                                                    })
                                                })
                                        }
                                    });

                                } else {
                                    return res.status(STATUS.FORBIDDEN_CODE).json({
                                        message: "Please check your current Password."
                                    })
                                }
                            })
                        } else {
                            return res.status(STATUS.NOT_FOUND_CODE).json({
                                message: "No admin available for given admin id."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: adminController.js:111 ~ AdminController ~ .exec ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })

            }
        } catch (err) {
            console.error("🚀 ~ file: adminController.js:119 ~ AdminController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Update Profile ----------
    * 
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * 
    * @return {Object} - It will give us Admin new details after update.
    * 
    * ---------------------------------------- */

    updateProfile = (req, res, next) => {

        try {

            const { adminData } = req
            const { body } = req;

            const validationSchema = Joi.object({
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                AdminModel.findByIdAndUpdate(adminData.adminId, {
                    ...value
                }, { new: true })
                    .select(["firstName", "lastName", "email", "type", "refreshToken"])
                    .exec().then((result) => {
                        if (result) {
                            return res.status(STATUS.SUCCESS_CODE).json({
                                message: "Profile updated successfully.",
                                data: result
                            })
                        } else {
                            return res.status(STATUS.NOT_FOUND_CODE).json({
                                message: "No admin available for given admin id."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: adminController.js:171 ~ AdminController ~ .exec ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }

        } catch (err) {
            console.error("🚀 ~ file: adminController.js:180 ~ AdminController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new AdminController();