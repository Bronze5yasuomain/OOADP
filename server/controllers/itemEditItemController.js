var ItemModel = require('../models/items');
var ItemModel = require('../models/transaction')
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

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

exports.update = function (req, res){
    var record_num = req.params.id;
    var updateData = {
        studentId: req.body.studentId,
        name: req.body.name,
        group: req.body.group,
        hobby: req.body.hobby
    }
    StudentModel.update(updateData, {where: { id: record_num}}).then((updatedRecord)=>{
        if (!updatedRecord || updatedRecord == 0){
            return res.send(400, {
                    message: "error"
            });
        }
        res.status(200).send({ message: "Updated student record:"+record_num});
    })
}

// Item authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/browse');
}