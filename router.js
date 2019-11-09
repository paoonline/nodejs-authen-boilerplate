import Authentication from './controllers/authentication'
import passportService from './service/passport'
import passport from 'passport'
import Product from './models/products';

const reqAuth = passport.authenticate('jwt', { session: false })
const reqSignin = passport.authenticate('local', { session: false })

// Model for product
function productHandle(productNames, productModifys, productQuantitys, _id) {
    return (
        new Product({
            _id: _id ? _id : null,
            productName: productNames,
            productModify: productModifys,
            productQuantity: productQuantitys
        })
    )
}

export default ((app) => {
    //CRUD
    app.get('/product_list', reqAuth, function (req, res) {
        const { Pagination } = req.body
        Product.find({}).sort({ productModify: -1 }).skip(parseInt(Pagination)).limit(10).exec(function (err, result) {
            if (err) { return res.status(422).send({ error: err }) }
            res.json(result)
        })
    })

    app.put('/product_create', reqAuth, function (req, res) {
        const { productNames, productModifys, productQuantitys } = req.body
        productHandle(productNames, productModifys, productQuantitys).save(function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    app.post('/product_update', reqAuth, function (req, res) {
        const { productNames, productModifys, productQuantitys, _id } = req.body
        Product.findByIdAndUpdate(_id, productHandle(productNames, productModifys, productQuantitys, _id), { upsert: true }, function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    app.delete('/product_delete', reqAuth, function (req, res) {
        Product.deleteOne({ _id: req.body._id }, function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    //signin signup
    app.post('/signin', reqSignin, Authentication.signin)
    app.post('/signup', Authentication.signup)
})