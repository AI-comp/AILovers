var express = require('express'),
    path = require('path'),
    Runner = require('./runner.js').Runner;

module.exports = function (app) {

    app.use(express.static(path.join(__dirname, '../client')));
    app.use('/replayer', express.static(path.join(__dirname, '../client/replayer')));

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/replayer', function (req, res) {
        res.locals.replay = req.param('replay');
        res.render('replayer');
    });

};