var ItemModel = require('../models/items');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

//image shit modules
var fs = require('fs');
var mime = require('mine');
var gravatar = require('gravatar');
//set image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

var Images = require('../models/images')


exports.list=function(req, res){
    ItemModel.findAll({
        attributes: ['name','price']
    }).then(function (items) {
        res.render('index', {
            title:"Item List",
            itemList: items,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        });
    });
};