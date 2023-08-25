const express = require("express")
require('dotenv').config(); // this need not to added in index file but sometimes it gives error so just in case we can add in index also however this is main file app.js

const app = express()

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// for swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml')
const fs = require("fs")
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/temp/",
}));

// morgan middleware (It should come before anything because this is how morgan works).
app.use(morgan('tiny'))


// import all routes here
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product')
const payment = require('./routes/payment')
const order = require('./routes/order')

// router middleware
app.use('/api/v1',home);
app.use('/api/v1',user);
app.use('/api/v1',product);
app.use('/api/v1',payment);
app.use('/api/v1',order);


// export app.js
module.exports =app ;