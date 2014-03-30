var express = require('express'),
    path = require('path'),
    Runner = require('./runner.js').Runner;

module.exports = function (app) {

    app.use(express.static(path.join(__dirname, '../client')));

    app.get('/', function (req, res) {
        res.render('index');
    });

    var runner = new Runner();

    app.get('/run', function (req, res) {
        runner.runGame();
        res.send('Running a game.');
    });

    app.get('/result', function (req, res) {
        res.send('<pre>' + runner.gameResult + '</pre>');
    });

};