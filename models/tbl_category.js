const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const { CATEGORY_CONFIG } = require('../config/constants');

const categorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
            require: true,
            unique: true
        },
        status: {
            type: String,
            enum: Object.values(CATEGORY_CONFIG.STATUS_TYPE),
            require: true,
            default: CATEGORY_CONFIG.STATUS_TYPE.ACTIVE
        },
    },
    {
        timestamps: true,
    }
)
categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_category', categorySchema)