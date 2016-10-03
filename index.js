(function () {

    'use strict';

    // dependencias
    const express = require('express');
    const bodyParser = require('body-parser'); // peticiones HTTP pasan por body parser
    const mongoose = require('mongoose');
    const $q = require('q');
    mongoose.Promise = $q.Promise;

    // models
    const Product = require('./models/product'); // no necesita extensión .js

    const app = express();
    const port = process.env.PORT || 3001; // constante para el puerto

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json()); // admitir params en formato JSON

    // app.get('/:name', function (req, res) { // los parámetros en el url se obtienen con :
    //     res.send({ message: 'Hola ' + req.params.name }); // envia data al client
    // });

    app.get('/api/product', function (req, res) {
        var products = [];
        var response = {
            products: products
        };

        res.status(200).send(response);
    });

    app.get('/api/product/:productId', function (req, res) {
        console.info('GET /api/product , body:');
        console.log(req.body);

        let productId = req.params.productId;
        let product = new Product();

        let promise = product.findById(productId);
        promise
            .then(succesfullReq)
            .catch(errReq);

        function succesfullReq (productStored) {
            res.status(200).send({
                product: productStored
            });
        }

        function errReq(err) {
            res.status(500).send({
                message: err
            });
        }

    });

    app.post('/api/product', function (req, res) {
        console.info('POST /api/product , body:');
        console.log(req.body);

        let data = req.body;
        let product = new Product();

        product.name = data.name;
        product.picture = data.picture;
        product.price = data.price;
        product.category = data.category;
        product.description = data.description;

        let promise = product.save();
        promise
            .then(succesfullReq)
            .catch(errorReq);

        function succesfullReq (productStored) {
            res.status(200).send({
                product: productStored
            });
        }

        function errorReq(err) {
            res.status(500).send({
                message: err
            });
        }

    });

    app.put('/api/product/:productId', function (req, res) {

    });

    app.delete('/api/product/:productId', function (req, res) {

    });

    // testing youtube-dl
    app.get('/api/youtube/dash/:videoId', function (req, res) {
        var youtubeDl = require('youtube-dl');
        var youtubeUrl = 'https://www.youtube.com/watch?v=' + req.params.videoId;
        var options = [];
        var formats = [];
        var format;

        youtubeDl.getInfo(youtubeUrl, options, function (err, info) {
            if(err){
                console.warn(err);
                throw err;
            }

            for(var i = 0; i < info.formats.length; i++){
                console.log(info.formats[i].url);
                format = {
                    format_id: info.formats[i].format_id,
                    dash_url: info.formats[i].url
                };
                formats.push(format);
            }

            res.status(200).send(formats);
        });
    });


    mongoose.connect('mongodb://localhost:27017', function (err, res) {
        if(err){
            return console.log('Error al conectar a la base de datos: ' + err);
        }

        console.log('Conexión a la base de datos establecida...');

        app.listen(port, function () {
            console.log('API REST running on localhost:' + port);
        });
    });

}());
