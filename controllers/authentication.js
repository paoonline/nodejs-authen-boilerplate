import UserCompany from '../models/userCompany';
import jwt from 'jwt-simple';
import config from '../config'

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

export const signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({token: tokenForUser(req.user)})
}

export const signup = (req, res, next) => {
    const {
        email, 
        password,
        ownName,
        companyName,
        companyAddress } = req.body
    // See if a user with the given email exists

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password' })
    }

    UserCompany.findOne({ email: email }, function (err, existingUser) {
        if (err) { return next(err) }

        // If a user with email does exits, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' })
        }

        // If a user with email NOT exists, create and save user record
        const userCompany = new UserCompany({
            email: email,
            password: password,
            ownName: ownName,
            companyName: companyName,
            companyAddress: companyAddress
        })

        userCompany.save(function (err) {
            if (err) { return next(err) }
            // Reopen to req indicating the user war created
            res.json({ token: tokenForUser(userCompany) })
        })
    })
}
