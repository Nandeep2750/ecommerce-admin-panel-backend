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
}

module.exports = new ProductController();