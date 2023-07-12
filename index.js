// modules/config/index.js
"use strict";

const express = require('express');
const bodyParser = require('body-parser');

module.exports = async (app) => {
    // create an express app for the REST server
    const restServer = express();
    // configure restServer to use bodyParser()
    // this will let us get the data from a POST
    restServer.use(bodyParser.urlencoded({ extended: false }));
    restServer.use(bodyParser.json());
    // get an instance of the express Router
    const router = express.Router();
    // setup the (by now) only get route on /
    router.get('/', (req, res) => app.gateway ? res.json(app.gateway) : res.json(app.device.values));
    router.post('/', (req, res) => {
        const { body } = req;
        Object.keys(app.attributes).forEach(attr => {
            if (body.hasOwnProperty(attr)) {
                app.attributes[attr] = body[attr];
            }
        });
        res.end();
      });
    // all of our routes will be prefixed with /
    restServer.use('/', router);
    // Listen for requests
    restServer.listen(4001, () => {
        app.logger.info(`REST api started on port ${4001}`);
    });
};
