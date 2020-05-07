import {signin, signup, authenEmail} from '../controllers/authentication'
import passportService from '../service/passport'
import passport from 'passport'
import {
    product_list,
    product_editone,
    product_create,
    product_update,
    product_delete,
    image_upload,
    product_search,
} 
from '../controllers/productManage'
const reqSignin = passport.authenticate('local', { session: false })
const reqAuth = passport.authenticate('jwt', { session: false })

export default ((app) => {
    //signin signup
    app.post('/signin', reqSignin, signin)
    app.post('/signup', signup)

    app.get('/product_list', reqAuth, product_list)
    app.get('/product_editone', reqAuth, product_editone)
    app.get('/product_search', reqAuth, product_search)
    app.get('/authenEmail', authenEmail)
    app.put('/product_create', reqAuth, product_create)
    app.delete('/product_delete', reqAuth, product_delete)
    app.post('/product_update', reqAuth, product_update)
    app.post('/image_upload', reqAuth, image_upload)
})