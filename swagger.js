const swaggerJsdoc = require('swagger-jsdoc');
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL;

const options = {
    swaggerDefinition: {
        info: {
            title: 'Employee Management API',
            version: '1.0.0',
            description: 'The application expose API endpoints that are use to manage employees'
        },
        servers: [
            { url: {swaggerServerUrl} } 
        ]
    },
    apis: ['./index.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
