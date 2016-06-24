var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    token: {
        type: String,
        unique: true
    }
});

var loginmodel = mongoose.model('loginmodel', userSchema);

module.exports = loginmodel;
