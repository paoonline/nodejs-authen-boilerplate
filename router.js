import Authentication from './controllers/authentication'
import passportService from './service/passport'
import passport from 'passport'

const reqAuth = passport.authenticate('jwt', { session: false })
const reqSignin = passport.authenticate('local', { session: false })

export default ((app) => {
    app.get('/', reqAuth, function (req, res) {
        res.send({ hi: "there" })
    })
    app.post('/signin', reqSignin, Authentication.signin)
    app.post('/signup', Authentication.signup)
})