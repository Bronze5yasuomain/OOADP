var ItemModel = require('../models/items');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req,res) {
    var itemdata = {
        name: req.body.name,
        id: req.body.id,
        price: req.body.price,
        description: req.body.description,
        condition: req.body.condition,
        category: req.body.category,
        quantity_left: req.body.quantity_left,
        seller_id: req.body.seller_id,
    }
    ItemModel.create(itemdata).then((newRecord, created) => {
        if (!newRecord){
            return res.send(400,{
                message:"error"
            });
        }
        res.redirect('/');
    })
};

exports.list=function(req, res){
    ItemModel.findAll({
        attributes: ['id','name','price','description','condition','category', 'quantity_left', 'seller_id']
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

exports.editRecord = function (req, res) {
    var record_num = req.params.id;
    ItemModel.findById(record_num).then(function (itemRecord){
        res.render('editRecord', {
            title: "Item list",
            item: itemRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.update=function(req, res){
    var record_num = req.params.id;
    var updateData = {
        name: req.body.name,
        id: req.body.id,
        price: req.body.price,
        description: req.body.description,
        condition: req.body.condition,
        category: req.body.category,
        quantity_left: req.body.quantity_left,
        seller_id: req.body.seller_id,
    }
    ItemModel.update(updateData,{where:{id:record_num} }).then((updatedRecord)=>{
        if (!updatedRecord || updatedRecord == 0){
            return res.send(400, {
                message:"error"
            });
        }
        res.status(200).send({message: "Updated Item record:" + record_num});
    })
}

exports.delete = function (req, res){
    var record_num = req.params.id;
    console.log("deleting"+record_num);
    ItemModel.destroy({where: {id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord){
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted item record:" + record_num});
    });
}

// Item authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}