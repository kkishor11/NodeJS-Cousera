/**
 * Author:Kundan Kishor
 */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promos = require('../models/promotions')

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promos.find({}).then((promos) => {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promos)
        }, (err) => next(err)).catch((err) => next(err));
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /promotions');
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.create(req.body).then((promo) => {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo)
        }, (err) => next(err)).catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.remove({}).then((result) => {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result)
        }, (err) => next(err)).catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promos.findById(req.params.promoId).then((promo) => {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo)
        }, (err) => next(err)).catch((err) => next(err));
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {
            new: true
        }).then((promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos.findByIdAndRemove(req.params.promoId).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = promoRouter;