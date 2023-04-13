const { status } = require('../config/statuscode')
const { PROJECT_NAME } = require('../config/constants');

const cmsApiRouter = require("./cms");
const appApiRouter = require("./app");
const webApiRouter = require("./web");

module.exports = app => {

    app.get('/', function (req, res) {
        res.send(`Welcome to ${PROJECT_NAME}!`);
    });

    app.use("/cms", cmsApiRouter);
    app.use("/app", appApiRouter);
    app.use("/web", webApiRouter);

    /* Handle is route is not available */
    app.use((req, res, next) => {
        const error = new Error('Sorry, this is an invalid Api')
        error.status = status.not_found_code
        next(error)
    })

    app.use((error, req, res, next) => {
        res.status(error.status || status.internal_server_error_code)
        res.json({
            message: error.message,
        })
    })
}