import passportService from '../service/passport'
import passport from 'passport'
import Product from '../models/products';
import upload from '../function/uploadMiddleware'
import Resize from '../function/Resize'
import path from 'path';
const reqAuth = passport.authenticate('jwt', { session: false })

// Model for product
function productHandle(productNames, productModifys, productQuantitys, productDescriptions, _id) {
    return (
        new Product({
            _id: _id ? _id : null,
            productName: productNames,
            productModify: productModifys,
            productQuantity: productQuantitys,
            productDescription: productDescriptions
        })
    )
}

export default ((app) => {
    //CRUD
    app.get('/product_list', reqAuth, function (req, res) {
        Product.find({}, { productDescription: 0 }).sort({ productModify: -1 }).exec(function (err, result) {
            if (err) { return res.status(422).send({ error: err }) }
            res.json(result)
        })
    })

    app.put('/product_create', reqAuth, function (req, res) {
        const { productNames, productModifys, productQuantitys } = req.body
        productHandle(productNames, productModifys, productQuantitys, productDescriptions).save(function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    app.post('/product_update', reqAuth, function (req, res) {
        const { productNames, productModifys, productQuantitys, _id } = req.body
        Product.findByIdAndUpdate(_id, productHandle(productNames, productModifys, productQuantitys, productDescriptions, _id), { upsert: true }, function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    app.delete('/product_delete', reqAuth, function (req, res) {
        Product.deleteOne({ _id: req.query._id }, function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.send({ status: true })
        })
    })

    app.post('/image_upload', reqAuth, upload.single('image'), async function (req, res) {
        const imagePath = path.join(__dirname, '/public/images');
        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            res.status(401).json({ error: 'Please provide an image' });
        }
        const filename = await fileUpload.save(req.file.buffer);

        Product.findByIdAndUpdate(req.body._id, { '$set': { imagePath: filename } }, { upsert: true }, function (err) {
            if (err) { return res.status(422).send({ error: err }) }
            res.status(200).json({ status: true, name: filename });
        })
    })

    app.get('/product_search', reqAuth, function (req, res) {
        Product.findOne({productName:req.body.productName}, { productDescription: 0 }).exec(function (err, result) {
            if (err) { return res.status(422).send({ error: err }) }
            res.json(result)
        })
    })
})