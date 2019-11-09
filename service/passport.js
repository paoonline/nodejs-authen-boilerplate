import passport from 'passport';
import User from '../models/user';
import config from '../config';
import LocalStrategy from 'passport-local'
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    // Verify this user and password
    // if it is the current user and password
    // otherwise, call done with false
    User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }

        // compare password
        user.comparePassword(password, function (err, isMatch) {
            if (err) { return done(err) }
            if (!isMatch) { return done(null, false) }

            return done(null, user)
        })
    })

})

// Set options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

// Create Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // See if the user ID in the payload exists in our db
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    User.findById(payload.sub, function (err, user) {
        if (err) { return next(err, false) }

        if (user) {
            done(null, user);
        } else {
            done(null, false)
        }
    })

})

// tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)