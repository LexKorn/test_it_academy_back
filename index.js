const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const router = require('./routes/index');

require('colors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Clinic API",
			version: "1.0.0",
			description: "A simple Express Clinic API",
		},
		servers: [
			{
				url: `http://localhost:${PORT}`,
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json({extended: true}));
app.use('/api', router);

const start = async() => {
    try {
        await mongoose.connect(process.env.MongoUri).then(console.log('Connect to MongoDB successfull!'.bgMagenta));
        
        app.listen(PORT, () => console.log(`Server has started on port ${PORT}`.bgCyan));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();