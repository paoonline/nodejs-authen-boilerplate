import User from '../models/user';
import jwt from 'jwt-simple';
import config from '../config'

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function (req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({token: tokenForUser(req.user)})
}

exports.signup = function (req, res, next) {
    const { email, password } = req.body
    // See if a user with the given email exists

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' })
    }

    User.findOne({ email: email }, function (err, existingUser) {
        if (err) { return next(err) }

        // If a user with email does exits, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' })
        }

        // If a user with email NOT exists, create and save user record
        const user = new User({
            email: email,
            password: password
        })

        user.save(function (err) {
            if (err) { return next(err) }
            // Reopen to req indicating the user war created
            res.json({ token: tokenForUser(user) })
        })
    })
}
