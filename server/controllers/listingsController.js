//Import modules
var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');
// set image file types
var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

var Listings = require('../models/listings');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

// Show images gallery
exports.show = function(req, res) {

    sequelize.query('select l.id, l.title, l.imageName, u.email AS user_id from Listings l join Users u on l.user_id = u.id', { model: Listings, raw:true}).then((listings) => {
        console.log("========================"+listings);
        res.render('profile', {
            title: "Profile Page",
            user: req.user,
            listings: listings,
            avatar: gravatar.url(req.user.user_id, { s: '80', r: 'x', d: 'retro' }, true),
        });

    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Image upload
exports.uploadImage = function (req, res) {
    console.log("===========================uuuuuuu=============================");
    var src;
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log(req.file);
    // get the mime type of the file
    var type = mime.lookup(req.file.mimetype);
    // get file extension
    var extension = req.file.path.split(/[. ]+ /).pop();
    // check support file types
    
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png.');
    }
    // set new path to images
    targetPath = './public/images/' + req.file.originalname;
    // using read stream API to read file 
    src = fs.createReadStream(tempPath);
    // using a write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    //Show error
    src.on('error', function (err) {
        if (err) {
            return res.status(500).send({
                message: error
            });
        }
    });

    //Save file process
    src.on('end', function () {
        // create a new instance of the Listings model with request body
        var listingData = {
            title: req.body.title,
            imageName: req.file.originalname,
            user_id : req.user.id
        }
        //Save to database
        Listings.create(listingData).then((newListing, created) => {
            if (!newListing) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('profile');
        })

        //remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            //Redirect to profile's page
            res.redirect('profile');
        });
    });
};

// Listings authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
