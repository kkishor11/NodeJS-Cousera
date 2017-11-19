/**
 * Author:Kundan Kishor
 */
const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all(function (req, res, next) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        next();
    })

    .get(function (req, res, next) {
        res.end('Will send all the leaders to you!');
    })

    .post(function (req, res, next) {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /leaders');
    })

    .delete(function (req, res, next) {
        res.end('Deleting all leaders');
    });

leaderRouter.route('/:leaderId')
    .all(function (req, res, next) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        next();
    })

    .get(function (req, res, next) {
        res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /leaders/' + req.params.leaderId);
    })

    .put(function (req, res, next) {
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name +
            ' with details: ' + req.body.description);
    })

    .delete(function (req, res, next) {
        res.end('Deleting leader: ' + req.params.leaderId);
    });

module.exports = leaderRouter;