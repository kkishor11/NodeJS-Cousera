const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');
const cors = require('./cors');

const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                postedBy: req.user._id
            }).populate('postedBy').populate('dishes')
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favourites);
            }, (err) => next(err)).catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                postedBy: req.user._id
            })
            .then((favourites) => {
                const dishesToAdd = req.body;
                if (favourites.length) {
                    if (favourites[0].dishes.length) {
                        for (var i = (favourites[0].dishes.length - 1); i >= 0; i--) {
                            if (dishesToAdd instanceof Object && dishesToAdd instanceof Array) {
                                for (var j = (dishesToAdd.length - 1); j >= 0; j--) {
                                    if (dishesToAdd[j]._id == favourites[0].dishes[i]) {
                                        const index = dishesToAdd.indexOf(dishesToAdd[j]);
                                        dishesToAdd.splice(index, 1);
                                    }
                                }
                            } else {
                                res.statusCode = 422;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end('You must pass an array of dishes');
                            }
                        }
                    }
                    if (dishesToAdd.length) {
                        dishesToAdd.forEach(dishId => {
                            favourites[0].dishes.push(dishId);
                        });
                        favourites[0].save((err, favourite) => {
                            if (err) throw err;
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        });
                    } else {
                        res.statusCode = 422;
                        res.setHeader('Content-Type', 'text/plain');
                        res.json('Dishes already exists in favourite');
                    }

                } else {
                    Favorites.create({
                        postedBy: req.user._id,
                        dishes: req.body
                    }, (err, favourite) => {
                        if (err) throw err;
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({
            postedBy: req.user._id
        }).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    });

favoritesRouter.route('/:dishId')
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                postedBy: req.user._id
            })
            .then((favourites) => {
                if (favourites.length) {
                    var favouriteExists = false;
                    if (favourites[0].dishes.length) {
                        for (var i = (favourites[0].dishes.length - 1); i >= 0; i--) {
                            console.log(favourites[0].dishes[i] == req.params.dishId)
                            console.log(favourites[0].dishes[i])
                            console.log(req.params.dishId)
                            favouriteExists = favourites[0].dishes[i] == req.params.dishId;
                            if (favouriteExists) {
                                break;
                            }
                        }
                    }
                    if (!favouriteExists) {
                        favourites[0].dishes.push(req.params.dishId);
                        favourites[0].save((err, favourite) => {
                            if (err) throw err;
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        });
                    } else {
                        res.statusCode = 422;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Dish already exists in favourite');
                    }

                } else {
                    Favorites.create({
                        postedBy: req.user._id,
                        dishes: req.params.dishId
                    }, (err, favourite) => {
                        if (err) throw err;
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                }
            }, (err) => next(err)).catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                postedBy: req.user._id
            })
            .then((favourites) => {
                if (favourites.length) {
                    if (favourites[0].dishes.length) {
                        for (var i = (favourites[0].dishes.length - 1); i >= 0; i--) {
                            if (favourites[0].dishes[i] == req.params.dishId) {
                                favourites[0].dishes.remove(req.params.dishId);
                            }
                        }
                        favourites[0].save(function (err, favourite) {
                            if (err) throw err;
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        });
                    }
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('No favourites found for the user');
                }
            }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = favoritesRouter;