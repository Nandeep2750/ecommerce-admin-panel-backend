const Joi = require('joi');

const CategoryModel = require('../../models/tbl_category')
const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');

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
                            message: "This Category Name is already registered please use another one."
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

}

module.exports = new CategoryController();