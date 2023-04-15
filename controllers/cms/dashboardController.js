const UserModel = require('../../models/tbl_user');
const ProductModel = require('../../models/tbl_product')

const { CmsController } = require('./cmsController');
const { STATUS } = require('../../config/statuscode');

class DashboardController extends CmsController {

    constructor() {
        super();
    }

    /** ---------- Get Dashboard cards counts ----------
    * 
    * @return {Object} - It will return Dashboard cards counts.
    * 
    * ---------------------------------------- */

    getDashboardDetails = async (req, res, next) => {

        try {
            let users = await UserModel.count()
            let products = await ProductModel.count()
            
            let responseData = {
                users : users,
                products: products,
            }

            return res.status(STATUS.SUCCESS_CODE).json({
                message: "Details fetched successfully.",
                data: responseData
            })

        } catch (err) {
            console.error("🚀 ~ file: dashboardController.js:36 ~ DashboardController ~ getDashboardDetails= ~ err:", err)
            return res.status(STATUS.INTERNAL_SERVER_ERROR_CODE).json({
                message: "Something went wrong.",
            });
        }
    }

}

module.exports = new DashboardController();