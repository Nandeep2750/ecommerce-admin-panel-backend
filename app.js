require('dotenv').config();
const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then(() => {
    console.log('Mongo db connected!');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// mongoose.set('debug', true);

/* ---------- morgan ---------- */
/* morgan is a Node.js and Express middleware to log HTTP requests and errors, and simplifies the process. */
/* :method :url :status :response-time ms - :res[content-length] */
app.use(morgan('dev'))

/* ---------- CORS ---------- */
/* CORS stands for Cross-Origin Resource Sharing . It allows us to relax the security applied to an API. This is done by bypassing the Access-Control-Allow-Origin headers, which specify which origins can access the API. */
app.use(cors());


/* ---------- bodyParser ---------- */
/* Express body-parser is an npm library used to process data sent through an HTTP request body. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* ---------- Create Server ---------- */
const port = process.env.PORT || 8080
const server = http.createServer(app);

server.listen(port, () => {
    console.info(`Server running on ${port}`);
});

module.exports = app;