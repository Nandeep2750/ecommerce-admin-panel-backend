const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'tbl_user'
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'tbl_product'
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
        }],
        totalAmount: {
            type: Number,
            require: true
        }
    },
    {
        timestamps: true,
    }
)
orderSchema.plugin(mongoosePaginate);
orderSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_order', orderSchema)