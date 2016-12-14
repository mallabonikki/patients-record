var db = require('./db');
var sql = require('./sql').users;

module.exports = {
    addUser: function (name, email, password, profileimage) {
        return db.none(sql.add, [name, email, password, profileimage])
    }
}; 