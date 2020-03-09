var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../app/models/user');

module.exports = function(passport) {


    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });


    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done){
            process.nextTick(function(){
                User.findOne({'local.username': username}, function(err, user){
                    if(err)
                        return done(err);
                    if(user){
                        return done(null, false, req.flash('signupMessage', 'That email already taken'));
                    } else {
                        var newUser = new User();
                        newUser.local.username = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
                })

            });
        }));

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done){
            process.nextTick(function(){
                User.findOne({ 'local.username': username}, function(err, user){
                    if(err)
                        return done(err);
                    if(!user)
                        return done(null, false, req.flash('loginMessage', 'No User found'));
                    if(!user.validPassword(password)){
                        return done(null, false, req.flash('loginMessage', 'invalid password'));
                    }
                    return done(null, user);

                });
            });
        }
    ));


};