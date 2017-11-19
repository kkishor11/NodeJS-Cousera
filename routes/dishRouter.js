/**
 * Author:Kundan Kishor
 */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get(function (req, res, next) {
        Dishes.find({}).then((dishes) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dishes);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post(function (req, res, next) {
        Dishes.create(req.body).then((dish) => {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
            console.log("Dish Created");
        }, (err) => next(err)).catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /dishes');
    })

    .delete(function (req, res, next) {
        Dishes.remove({}).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    })

dishRouter.route('/:dishId')
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId).then((dishe) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dishe);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /dishes/' + req.params.dishId);
    })

    .put(function (req, res, next) {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, {
            new: true
        }).then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .delete(function (req, res, next) {
        Dishes.findByIdAndRemove(req.params.dishId).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = dishRouter;