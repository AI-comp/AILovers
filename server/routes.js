var express = require('express'),
    path = require('path'),
    Runner = require('./runner.js').Runner;

module.exports = function (app) {

    app.use(express.static(path.join(__dirname, '../client')));
    app.use('/cocos2d', express.static(path.join(__dirname, '../client/cocos2d')));
    app.use('/replay', express.static(path.join(__dirname, '../client/js')));
    
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/replay', function (req, res) {
        res.render('replay');
    });

};