var express = require('express'),
    path = require('path');

module.exports = function(app) {

    app.use(express.static(path.join(__dirname, '../client')));

    app.get('/', function (req, res) {
        res.render('index');
    });

};