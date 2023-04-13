const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');

const adminSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true,
        },
        refreshToken: {
            type: String,
            require: true,
        },
        refreshTokenCreatedAt: {
            type: Number, /* timestamp */
            require: true,
        }
    },
    {
        timestamps: true,
    }
)
adminSchema.plugin(mongoosePaginate);
adminSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_admin', adminSchema)