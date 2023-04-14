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

module.exports = {
    PROJECT_NAME,
    ADMIN_CONFIG
};