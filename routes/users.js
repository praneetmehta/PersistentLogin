var express = require('express');
var router = express.Router();
var newUser = require('../schemas/registrationSchema.js');
var newLogin = require('../schemas/loginSchema.js');
var sessions = require('../schemas/sessionSchema.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/home', function(req, res) {
    if (!req.session.user) {
        res.send('You are not authorized.. Login to view this content!!')
    } else if (req.session.user) {
        res.render('dashboard', {
            title: req.session.user
        })
    }
});
router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register');
});

//submit registration form through POST request
router.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    if (firstname == '' || lastname == '' || username == '' || password == '') {
        res.redirect('/users/register');
    } else {
        console.log('entered');

        var newuser = new newUser;

        newuser.firstname = firstname;
        newuser.lastname = lastname;
        newuser.username = username;
        newuser.password = password;
        newuser.save(function(err, savedObject) {
            if (err) {
                console.log(err);
                res.status(500).send();
                res.redirect('/users/login');
            } else {
                console.log('User registered');
                res.redirect('/users/login');
            };
        });
    }
});
var user;
//login request
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    newUser.findOne({
        username: username,
        password: password
    }, function(err, newUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else if (!newUser) {
            console.log('Invalid Username or Password');
            return res.redirect('/users/login');
        }
        user = username;
        if (username == 'admin' && password == 'admin') {
            console.log('Hey admin!!');
            return res.render('ad');
        } else {
            req.session.user = username;
            console.log(req.session.user);
            return res.redirect('/users/home');
        }
    });
});


router.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/users/login');
        console.log('true');
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;
