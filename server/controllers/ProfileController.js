var ProfileModel = require('../models/profile');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// Add a new user record to database
exports.insert = function (req, res) {
    var profileData = {
        userId : req.body.userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender
    }
    ProfileModel.create(profileData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/profile');
    })
};

//List one specific user record from database
exports.editRecord = function (req, res) {
    var record_num = req.params.id;
    ProfileModel.findById(record_num).then(function (userRecord) {
        res.render('editprofile', {
            title: "Edit Profile Page",
            item: userRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Update user record in database
exports.update = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        userId : req.body.userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        gender: req.body.gender
    }
    ProfileModel.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated user record:" + record_num });
    })
}

// Edit Profile authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

exports.show = function(req, res) {
	res.render('editprofile', {
		user: req.user
	});
};