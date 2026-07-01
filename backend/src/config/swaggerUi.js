// swagger.js
const swaggerAutoGen = require('swagger-autogen')();

const outputFile = '../../swagger-output.json';
const endpointsFiles = ['../routes/*.js']; // Adjust the path to your routes

swaggerAutoGen(outputFile, endpointsFiles);
