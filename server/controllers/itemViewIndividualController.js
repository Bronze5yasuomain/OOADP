var ItemModel = require('../models/items');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

/* Ernest this block of codes causes errors 
//image shit modules
var fs = require('fs');
var mime = require('mine');
var gravatar = require('gravatar');
//set image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

var Images = require('../models/images')
 */


exports.list=function(req, res){
    ItemModel.findAll({
        attributes: ['name','price','description','category']
    }).then(function (items) {
        res.render('item', {
            title:"Individual Item",
            itemList: items,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        });
    });
};

// Item authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/browse');
}