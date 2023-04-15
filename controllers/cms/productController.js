const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const CategoryModel = require('../../models/tbl_category')
const ProductModel = require('../../models/tbl_product')
const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');

class ProductController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Create Product ----------
    * 
    * @param {String} productName - Product Name.
    * @param {ObjectId} categoryId - Category Id.
    * @param {Text} productDescription - Product Description.
    * @param {URL} productImageUrl - Product Image Url.
    * @param {Number} productPrice - Product Price.
    * 
    * @return {Object} - Will get Object data after create new Product.
    * 
    * ---------------------------------------- */

    createProduct = async (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                productName: Joi.string().required(),
                categoryId: Joi.objectId().required(),
                productDescription: Joi.string().required(),
                productImageUrl: Joi.string().uri().required(),
                productPrice: Joi.number().required()
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                /* Check category is available for given categoryId */
                let category = await CategoryModel.findById(value.categoryId)
                if (category === null) {
                    return res.status(STATUS.NOT_FOUND_CODE).json({
                        message: `category not found for given categoryId.`
                    })
                }

                let product = new ProductModel(value)
                product.save().then((result) => {
                    return res.status(STATUS.CREATED_CODE).json({
                        message: "Product created successfully.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: productController.js:62 ~ ProductController ~ product.save ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });
            }

        } catch (err) {
            console.error("🚀 ~ file: productController.js:70 ~ ProductController ~ createProduct= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Get Paginate Products List ----------
    * 
    * @param {Number} page - Page number.
    * @param {Number} limit - Data limit perpage.
    * @param {String} search - It's use for search by productName, productDescription.
    * @param {ObjectId} categoryId - category Id for filter.
    * 
    * @return {Array} - It will give us Paginate list of Products.
    * 
    * ---------------------------------------- */

    getPaginateProductsList = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                page: Joi.number().required(),
                limit: Joi.number().required(),
                search: Joi.string().allow(null, ''),
                categoryId: Joi.objectId().allow(null, ''),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {
                let query = {
                    $or: [
                        { productName: new RegExp(value.search, "gi") },
                        { productDescription: new RegExp(value.search, "gi") },
                    ]
                };

                if (value.categoryId) {
                    query.categoryId = value.categoryId
                }
                let options = {
                    sort: { createdAt: -1 },
                    page: value.page || PAGINATION_CONFIG.PAGE,
                    limit: value.limit || PAGINATION_CONFIG.LIMIT,
                    select: ['productName', 'categoryId', 'productDescription', 'productImageUrl', 'productPrice'],
                    populate: {
                        path: 'categoryId',
                        select: 'categoryName',
                    },
                };

                ProductModel.paginate(query, options).then((result) => {
                    return res.status(STATUS.SUCCESS_CODE).json({
                        message: "Successfully find products.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: productController.js:129 ~ ProductController ~ ProductModel.paginate ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });
            }

        } catch (err) {
            console.error("🚀 ~ file: productController.js:138 ~ ProductController ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Update Product ----------
    * 
    * @param {ObjectId} _id - Product Id.
    * @param {String} productName - Product Name.
    * @param {ObjectId} categoryId - Category Id.
    * @param {Text} productDescription - Product Description.
    * @param {URL} productImageUrl - Product Image Url.
    * @param {Number} productPrice - Product Price.
    * 
    * @return {Object} - Will get Object data after update Product.
    * 
    * ---------------------------------------- */

    updateProduct = async (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required(),
                productName: Joi.string().optional(),
                categoryId: Joi.objectId().optional(),
                productDescription: Joi.string().optional(),
                productImageUrl: Joi.string().uri().optional(),
                productPrice: Joi.number().optional()
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                if (value.categoryId) {
                    /* Check category is available for given categoryId */
                    let category = await CategoryModel.findById(value.categoryId)
                    if (category === null) {
                        return res.status(STATUS.NOT_FOUND_CODE).json({
                            message: `category not found for given categoryId.`
                        })
                    }
                }

                ProductModel.findByIdAndUpdate(value._id, {
                    ...value
                }, { new: true }).select(['productName', 'categoryId', 'productDescription', 'productImageUrl', 'productPrice']).populate({
                    path: "categoryId",
                    select: ["categoryName"]
                })
                    .exec().then((result) => {
                        if (result) {
                            return res.status(STATUS.SUCCESS_CODE).json({
                                message: "Product updated successfully.",
                                data: result
                            })
                        } else {
                            return res.status(STATUS.NOT_FOUND_CODE).json({
                                message: "No Product available for given id."
                            })
                        }
                    }).catch((err) => {
                        console.error("🚀 ~ file: productController.js:210 ~ ProductController ~ .exec ~ err:", err)
                        return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                            message: err.message
                        })
                    })
            }

        } catch (err) {
            console.error("🚀 ~ file: productController.js:218 ~ ProductController ~ updateProduct= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new ProductController();