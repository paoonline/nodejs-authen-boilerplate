import Authentication from '../controllers/authentication'
import passportService from '../service/passport'
import passport from 'passport'
const reqSignin = passport.authenticate('local', { session: false })

export default ((app) => {
    //signin signup
    app.post('/signin', reqSignin, Authentication.signin)
    app.post('/signup', Authentication.signup)
})