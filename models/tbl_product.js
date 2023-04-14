const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');

const productSchema = mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'tbl_category'
        },
        productName: {
            type: String,
            require: true,
        },
        productDescription: {
            type: String,
            require: true,
        },
        productImageUrl: {
            type: String,
            require: true,
        },
        productPrice: {
            type: Number,
            require: true,
        }
    },
    {
        timestamps: true,
    }
)
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_product', productSchema)