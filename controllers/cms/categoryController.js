const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const CategoryModel = require('../../models/tbl_category')
const ProductModel = require('../../models/tbl_product')
const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');
const { CATEGORY_CONFIG } = require('../../config/constants');

class CategoryController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Create Category ----------
    * 
    * @param {String} categoryName - categoryName.
    * 
    * @return {Object} - Will get Object data after create new category.
    * 
    * ---------------------------------------- */

    createCategory = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                categoryName: Joi.string().required(),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                CategoryModel.findOne({ categoryName: value.categoryName }).exec().then((category) => {
                    if (category) {
                        return res.status(STATUS.CONFLICT_CODE).json({
                            message: "This Category Name is already available please use another one."
                        })
                    } else {
                        let category = new CategoryModel(value)
                        category.save().then((result) => {
                            return res.status(STATUS.CREATED_CODE).json({
                                message: "Category created successfully.",
                                data: result
                            })
                        }).catch((err) => {
                            console.error("🚀 ~ file: categoryController.js:51 ~ CategoryController ~ category.save ~ err:", err)
                            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                message: err.message
                            })
                        });
                    }
                }).catch((err) => {
                    console.error("🚀 ~ file: categoryController.js:59 ~ CategoryController ~ CategoryModel.findOne ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                })
            }

        } catch (err) {
            console.error("🚀 ~ file: categoryController.js:68 ~ CategoryController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Get Paginate Category List ----------
    * 
    * @param {Number} page - Page number.
    * @param {Number} limit - Data limit perpage.
    * @param {String} status - Status.
    * 
    * @return {Array} - It will give us Paginate list of categories.
    * 
    * ---------------------------------------- */

    getPaginateCategoriesList = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                page: Joi.number().required(),
                limit: Joi.number().required(),
                status: Joi.string().optional().allow(null, '').valid(...Object.values(CATEGORY_CONFIG.STATUS_TYPE)),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                let query = {};

                if (value.status) {
                    query.status = value.status
                }
                let options = {
                    sort: { createdAt: -1 },
                    page: value.page || PAGINATION_CONFIG.PAGE,
                    limit: value.limit || PAGINATION_CONFIG.LIMIT,
                    select: ['categoryName', "status"]
                };

                CategoryModel.paginate(query, options).then((result) => {
                    return res.status(STATUS.SUCCESS_CODE).json({
                        message: "Successfully find categories.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: categoryController.js:110 ~ CategoryController ~ CategoryModel.paginate ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });
            }

        } catch (err) {
            console.error("🚀 ~ file: categoryController.js:119 ~ CategoryController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Category List ----------
    * 
    * @param {String} status - Status.
    * 
    * @return {Array} - It will give us Paginate list of categories.
    * 
    * ---------------------------------------- */

    getCategoriesList = (req, res, next) => {

        try {

            const { query } = req;

            const validationSchema = Joi.object({
                status: Joi.string().optional().allow(null, '').valid(...Object.values(CATEGORY_CONFIG.STATUS_TYPE)),
            });
            const { error, value } = validationSchema.validate(query);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                let filter = {};

                if (value.status) {
                    filter.status = value.status
                }

                CategoryModel.find(filter).select(["categoryName", "status"]).then((result) => {
                    return res.status(STATUS.SUCCESS_CODE).json({
                        message: "Successfully find categories.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: categoryController.js:141 ~ CategoryController ~ CategoryModel.find ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });
            }


        } catch (err) {
            console.error("🚀 ~ file: categoryController.js:149 ~ CategoryController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    
    /** ---------- Update Category ----------
    * 
    * @param {ObjectId} _id - Category Id.
    * @param {String} categoryName - Category Name.
    * @param {String} status - Status.
    * 
    * @return {Object} - Will get Object data after update Category.
    * 
    * ---------------------------------------- */

    updatecategory = async (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required(),
                categoryName: Joi.string().optional(),
                status: Joi.string().optional().valid(...Object.values(CATEGORY_CONFIG.STATUS_TYPE)),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                CategoryModel.findByIdAndUpdate(value._id, { ...value }, { new: true })
                .select(["categoryName","status"]).exec().then((result) => {
                    if (result) {
                        return res.status(STATUS.SUCCESS_CODE).json({
                            message: `Category updated successfully.`,
                            data: result
                        })
                    } else {
                        return res.status(STATUS.NOT_FOUND_CODE).json({
                            message: "No Category found for given id."
                        })
                    }
                }).catch((err) => {
                    console.error("🚀 ~ file: categoryController.js:226 ~ CategoryController ~ .select ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                })
            }

        } catch (err) {
            console.error("🚀 ~ file: categoryController.js:235 ~ CategoryController ~ updatecategory= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Delete Category ----------
    * 
    * @param {objectId} _id - Category ID.
    * 
    * @return {Object} - It will give us success details after delete.
    * 
    * ---------------------------------------- */

    deleteCategory = async (req, res, next) => {
        try {
            const { query } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required()
            });
            const { error, value } = validationSchema.validate(query);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                let availableProductCount = await ProductModel.count({
                    categoryId: value._id
                });

                if (availableProductCount > 0) {
                    return res.status(STATUS.FORBIDDEN_CODE).json({
                        message: `There are ${availableProductCount} products created for this category, So you can't delete this Category.`
                    })
                }

                CategoryModel.findById(value._id).exec().then((result) => {
                    if (result) {
                        CategoryModel.findOneAndDelete({_id : value._id}).then((result) => {
                            if (result) {
                                return res.status(STATUS.SUCCESS_CODE).json({
                                    message: "Category deleted successfully.",
                                })
                            } else {
                                return res.status(STATUS.NOT_FOUND_CODE).json({
                                    message: "No Category available for given id."
                                })
                            }
                        }).catch((err) => {
                            console.error("🚀 ~ file: TaskTypeController.js ~ line 302 ~ TaskTypeController ~ CategoryModel.deleteById ~ err", err)
                            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                                message: err.message
                            })
                        })
                    } else {
                        return res.status(STATUS.NOT_FOUND_CODE).json({
                            message: "No Category available for given id."
                        })
                    }
                }).catch((err) => {
                    console.error("🚀 ~ file: TaskTypeController.js ~ line 207 ~ TaskTypeController ~ .then ~ err", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                })
            }
        } catch (err) {
            console.error("🚀 ~ file: TaskTypeController.js ~ line 320 ~ TaskTypeController ~ deleteCategory ~ err", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new CategoryController();