var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

//connection.query('USE' + dbconfig.database);

module.exports = function(passport){
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM loginDetails WHERE personID = ?", [id],
            function(err,rows){
                done(err, rows[0]);
            });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },

          function (req,username,password, done) {
            connection.query("SELECT * FROM  loginDetails WHERE userName = ?",
                [username], function(err, rows){
                if(err)
                    return done(err);
                if(rows.length){
                    return done(null, false, req.flash('signupMesssage', 'That is already taken'));
                }else{
                    var newUserMysql = {
                        username : username,
                        password : bcrypt.hashSync(password, null, null)
                    };

                    var insertQuery = "INSERT INTO loginDetails (userName, userPassword ) values (?,?)";

                    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
                        function (err,rows) {
                          newUserMysql.id = rows.personID;

                          return done(null, newUserMysql);
                        });
                     }
                });
            })
        );
    passport.use(
        'login-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
         function(req, username, password, done){
            connection.query("SELECT * FROM loginDetails WHERE userName = ?", [username],
                function(err,rows){
                    if(err)
                        return done(err);
                    if(!rows.length){
                        return done(null, false, req.flash('loginMessage', 'No User Found'));
                    }
                    if(!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Wrong Password'));

                    return done(null, rows[0]);
                });
         })
    );
};


