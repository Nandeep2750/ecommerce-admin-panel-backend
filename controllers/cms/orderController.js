const ObjectId = require("mongoose").Types.ObjectId;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const OrderModel = require('../../models/tbl_order')
const UserModel = require('../../models/tbl_user');
const ProductModel = require('../../models/tbl_product')
const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');

class ProductController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Create Order ----------
    * 
    * @param {ObjectId} userId - User Id.
    * @param {Array} items - Array of Object includes productId, quantity.
    * 
    * @return {Object} - Will get data after create new Order.
    * 
    * ---------------------------------------- */

    createOrder = async (req, res, next) => {

        try {
            const { body } = req;

            let users = await UserModel.find().select(['_id'])
            let userIds = users.reduce((acc, curr) => {
                if (curr.id) {
                    acc.push(curr.id)
                }
                return acc
            }, [])

            let products = await ProductModel.find().select(['productPrice'])
            let productIds = products.reduce((acc, curr) => {
                if (curr.id) {
                    acc.push(curr.id)
                }
                return acc
            }, [])

            let productPriceMapping = products.reduce((acc, curr) => {
                if (curr.id) {
                    acc[curr.id] = curr.productPrice
                }
                return acc
            }, {})

            const validationSchema = Joi.object({
                userId: Joi.objectId().required().custom((value, helper) => {
                    if (userIds.includes(value)) {
                        return value
                    }
                    return helper.message(`userId must be one of ${userIds}`)

                }),
                items: Joi.array().items(
                    Joi.object({
                        productId: Joi.objectId().required().custom((value, helper) => {
                            if (productIds.includes(value)) {
                                return value
                            }
                            return helper.message(`productId must be one of ${productIds}`)
                        }),
                        quantity: Joi.number().integer().positive().required()
                    })
                ).required().min(1),
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(STATUS.BAD_REQUEST_CODE).json({
                    message: error.message,
                })
            } else {

                let data = value

                data.items = data.items.reduce((acc, curr) => {
                    if (curr) {
                        acc.push({ ...curr, price: productPriceMapping[curr.productId] })
                    }
                    return acc
                }, [])
                
                
                data.totalAmount = data.items.reduce((acc, curr) => {
                    if (curr) {
                        acc = acc + (curr.price * curr.quantity)
                    }
                    return acc
                }, 0)

                let order = new OrderModel(data)                
                order.save().then((result) => {
                    return res.status(STATUS.CREATED_CODE).json({
                        message: "Order created successfully.",
                        data: result
                    })
                }).catch((err) => {
                    console.error("🚀 ~ file: orderController.js:106 ~ ProductController ~ order.save ~ err:", err)
                    return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                        message: err.message
                    })
                });

            }

        } catch (err) {
            console.error("🚀 ~ file: orderController.js:115 ~ ProductController ~ createOrder= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new ProductController();