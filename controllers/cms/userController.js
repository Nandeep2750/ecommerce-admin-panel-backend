const bcrypt = require('bcrypt');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const { CmsController } = require('./cmsController');
const UserModel = require('../../models/tbl_user');
const { STATUS } = require('../../config/statuscode');
const { PAGINATION_CONFIG, USER_CONFIG } = require('../../config/constants');

class UserController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Get User List  ----------
    * 
    * @param {Number} page - Page number.
    * @param {Number} limit - Data limit perpage.
    * @param {String} search - It's use for search by name, email.
    * 
    * @return {Array} - It will give us list of Users.
    * 
    * ---------------------------------------- */

    getUserList = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                page: Joi.number().required(),
                limit: Joi.number().required(),
                search: Joi.string().allow(null, '')
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                let query = {
                    $or: [
                        { firstName: new RegExp(value.search, "gi") },
                        { lastName: new RegExp(value.search, "gi") },
                        { email: new RegExp(value.search, "gi") },
                    ]
                };
                let options = {
                    sort: { createdAt: -1 },
                    page: value.page || PAGINATION_CONFIG.PAGE,
                    limit: value.limit || PAGINATION_CONFIG.LIMIT,
                    select: ['firstName', 'lastName', 'email', 'gender', 'status']
                };

                UserModel.paginate(query, options).then((result) => {
                    return res.status(STATUS.SUCCESS_CODE).json({
                        message: "Successfully find users.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: userController.js:62 ~ UserController ~ UserModel.paginate ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });
            }

        } catch (err) {
            console.error("🚀 ~ file: userController.js:70 ~ UserController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Get All User List  ----------
    * 
    * @return {Array} - It will give us list of Users.
    * 
    * ---------------------------------------- */

    getAllUserList = (req, res, next) => {

        try {
            UserModel.find().select(['firstName', 'lastName', 'email', 'gender', 'status']).then((result) => {
                return res.status(STATUS.SUCCESS_CODE).json({
                    message: "Successfully find all users.",
                    data: result
                })
            }).catch((err) => {
                console.error("🚀 ~ file: userController.js:94 ~ UserController ~ UserModel.find ~ err:", err)
                return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                    message: err.message
                })
            });
        } catch (err) {
            console.error("🚀 ~ file: userController.js:99 ~ UserController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Get User By ID ----------
    * 
    * @param {String} userId - User ID.
    * 
    * @return {Object} - It will give us User details.
    * 
    * ---------------------------------------- */

    getUserByID = (req, res, next) => {

        try {

            const { query } = req;

            const validationSchema = Joi.object({
                userId: Joi.objectId().required()
            });
            const { error, value } = validationSchema.validate(query);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                UserModel.findById(value.userId)
                    .select(['firstName', 'lastName', 'email', 'gender', 'status'])
                    .exec().then((result) => {
                        if (result) {
                            return res.status(STATUS.SUCCESS_CODE).json({
                                message: "User details fetched successfully",
                                data: result
                            })
                        } else {
                            return res.status(STATUS.NOT_FOUND_CODE).json({
                                message: "No user available for given id."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: userController.js:116 ~ UserController ~ .exec ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.error("🚀 ~ file: userController.js:123 ~ UserController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Create User  ----------
    * 
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * @param {String} email - Email.
    * @param {String} password - Password.
    * @param {String} gender - Gender.
    * 
    * @return {Object} - It will give result after create new user.
    * 
    * ---------------------------------------- */

    createUser = (req, res, next) => {

        try {
            const { body } = req;
            const { GENDER } = USER_CONFIG;

            const validationSchema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required(),
                gender: Joi.string().required().valid(...Object.values(GENDER)),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                let filter = {
                    email: value.email
                }

                UserModel.findOne(filter)
                    .exec()
                    .then((user) => {
                        if (user) {
                            if (value.email && user.email === value.email) {
                                return res.status(STATUS.CONFLICT_CODE).json({
                                    message: `This user is already registered with this email, please use another one.`
                                })
                            }
                        } else {

                            if (value.password) {
                                let hashPassword = bcrypt.hashSync(value.password, USER_CONFIG.SALT_ROUNDS);
                                value.password = hashPassword
                            }

                            let user = new UserModel(value)
                            user.save().then((result) => {
                                return res.status(STATUS.CREATED_CODE).json({
                                    message: "User successfully added.",
                                    data: result
                                })
                            }).catch((err) => {
                                console.error("🚀 ~ file: userController.js:142 ~ UserController ~ user.save ~ err:", err)
                                return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                    message: err.message
                                })
                            });
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: userController.js:149 ~ UserController ~ .then ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.error("🚀 ~ file: userController.js:157 ~ UserController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Update User ----------
    * 
    * @param {ObjectId} _id - User Id.
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * @param {String} gender - Gender.
    * @param {String} status - Status.
    * 
    * @return {Object} - Will get Object data after update User.
    * 
    * ---------------------------------------- */

    updateUser = async (req, res, next) => {

        try {
            const { body } = req;
            const { GENDER } = USER_CONFIG;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required(),
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                gender: Joi.string().optional().valid(...Object.values(GENDER)),
                status: Joi.string().optional().valid(USER_CONFIG.STATUS_TYPE.ACTIVE, USER_CONFIG.STATUS_TYPE.INACTIVE)
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                UserModel.findByIdAndUpdate(value._id, { ...value }, { new: true })
                .select(["firstName","lastName","email","gender","status"]).exec().then((result) => {
                    if (result) {
                        return res.status(STATUS.SUCCESS_CODE).json({
                            message: `User updated successfully.`,
                            data: result
                        })
                    } else {
                        return res.status(STATUS.NOT_FOUND_CODE).json({
                            message: "No User found for given id."
                        })
                    }
                }).catch((err) => {
                    console.error("🚀 ~ file: userController.js:119 ~ UserController ~ .exec ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                })
            }

        } catch (err) {
            console.error("🚀 ~ file: userController.js:266 ~ UserController ~ updateUser= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Active/Inactive User ----------
    * 
    * @param {String} userId - User ID.
    * @param {Boolean} status - Status.
    * 
    * @return {Object} - It will give us User details.
    * 
    * ---------------------------------------- */

    activeInactiveUser = (req, res, next) => {

        try {

            const { body } = req;

            const validationSchema = Joi.object({
                userId: Joi.objectId().required(),
                status: Joi.string().required().valid(USER_CONFIG.STATUS_TYPE.ACTIVE, USER_CONFIG.STATUS_TYPE.INACTIVE),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                UserModel.findByIdAndUpdate(value.userId, {
                    status: value.status
                }, { new: true })
                    .select(['firstName', 'lastName', 'email', 'status'])
                    .exec().then((result) => {
                        if (result) {
                            return res.status(STATUS.SUCCESS_CODE).json({
                                message: `Account successfully ${result.status}`,
                                data: result
                            })
                        } else {
                            return res.status(STATUS.NOT_FOUND_CODE).json({
                                message: "No User found for given id."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: userController.js:315 ~ UserController ~ .exec ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.error("🚀 ~ file: userController.js:126 ~ UserController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new UserController();