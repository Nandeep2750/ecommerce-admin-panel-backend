const PROJECT_NAME = process.env.PROJECT_NAME || 'Ecommerce Admin Panel'

const ADMIN_CONFIG = {
    password: {
        min: 8,
        max: 20,
    },
    saltRounds: 10,
    tokenExpiresIn: '24h',
    refreshTokenValidForDays: 4  /* In Days */
}

module.exports = {
    PROJECT_NAME,
    ADMIN_CONFIG
};