const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');

const categorySchema = mongoose.Schema(
    {
        categoryName: {
            type: String,
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