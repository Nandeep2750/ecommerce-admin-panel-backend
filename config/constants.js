const PROJECT_NAME = process.env.PROJECT_NAME || 'Ecommerce Admin Panel'

const ADMIN_CONFIG = {
    JWT_KEY: 'auth.secret.admin',
    PASSWORD: {
        MIN: 8,
        MAX: 20,
    },
    SALT_ROUNDS: 10,
    TOKEN_EXPIRES_IN: '24h',
    REFRESH_TOKEN_VALID_FOR_DAYS: 4  /* In Days */
}

const USER_CONFIG = {
    GENDER:{
        MALE: "MALE",
        FEMALE: "FEMALE",
    },
    STATUS_TYPE: {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
        PENDING: "PENDING"
    },
    PASSWORD: {
        MIN: 8,
        MAX: 20,
    },
    SALT_ROUNDS: 10,
}

const PAGINATION_CONFIG = {
    PAGE: 1,
    LIMIT: 10
}

module.exports = {
    PROJECT_NAME,
    ADMIN_CONFIG,
    USER_CONFIG,
    PAGINATION_CONFIG
};