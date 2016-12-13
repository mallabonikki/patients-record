var db = require('./db');
var sql = require('./sql').sessions;

module.exports = {

    addUser: function (name, email, password, profileimage) {
        return db.none(name, email, password, profileimage)
    }
}; 