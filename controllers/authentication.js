import UserCompany from '../models/userCompany';
import jwt from 'jwt-simple';
import config from '../config'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import jwtDecode from 'jwt-decode'
const dotenvs = dotenv.config()

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

export const signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({token: tokenForUser(req.user)})
}

export const authenEmail = (req, res, next) => {
    let decodedToken = jwtDecode(req.query.token);
    let dateCurrent = new Date() * 1
    if (Math.abs(decodedToken.iat - dateCurrent) < 3600000) {
        UserCompany.findByIdAndUpdate(decodedToken.sub, { $set :{isActive: true},$unset: {lastModifiedDate: 1 }}, { upsert:true }, (err, result) => {
            if (err) { return res.status(422).send({ error: err }) }
            res.send(`
            <html>
                <body>
                    <p><b>ยืนยันตัวตนสำเร็จ</b></p
                </body>
            </html>
            `)
        })
    }
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

    UserCompany.findOne({ email: email }, async function (err, existingUser) {
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

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: `${process.env.HOST}`,
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: `${process.env.EMAIL}`, // generated ethereal user
            pass: `${process.env.PASSWORD}` // generated ethereal password
          }
        });
        let mailOptions = {
            from: `${process.env.EMAIL}`,
            to: email,
            subject: 'สมัครสมาชิกสำเร็จ',
            text: 'Hello',
            html: `
                <p><b>โปรดยืนยันตัวตนที่</b><p>
                <a href=http://localhost:3090/authenEmail?token=${tokenForUser(userCompany)}>
                    ลิ้งนี้
                </a>
            `
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        userCompany.save(function (err) {
            if (err) { return next(err) }
            // Reopen to req indicating the user war created
            res.json({ register: `http://localhost:3090/authenEmail?token=${tokenForUser(userCompany)}` })
        })
    })
}
