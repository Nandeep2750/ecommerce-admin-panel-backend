const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const { USER_CONFIG } = require('../config/constants');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        gender: {
            type: String,
            require: true,
            enum: Object.values(USER_CONFIG.GENDER),
        },
        password: {
            type: String,
            require: true,
        },
        status: {
            type: String,
            enum: Object.values(USER_CONFIG.STATUS_TYPE),
            require: true,
            default: USER_CONFIG.STATUS_TYPE.ACTIVE
        },
        refreshToken: {
            type: String,
            require: true,
        },
        refreshTokenCreatedAt: {
            type: Number, /* timestamp */
            require: true,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_user', userSchema)