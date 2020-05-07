import Product from '../models/products';
import 'firebase/storage'
import admin from 'firebase-admin'
import config from '../config'
import Resize from '../function/Resize'

// Model for product
function productHandle(productNames, productQuantitys, productDescriptions, imagePath, _id, edit) {
    const id = _id ? { _id: _id } : null
    return (
        new Product({
            id,
            productName: productNames,
            productModify: new Date() * 1,
            productQuantity: productQuantitys,
            productDescription: productDescriptions,
            imagePath: imagePath ? imagePath : ""
        }, {
            _id: edit ? false : true,
            id: edit ? false : true
        }
        )
    )
}

export const product_list = (req, res, next) => {
    Product.find({}, { productDescription: 0 }).sort({ productModify: -1 }).exec(function (err, result) {
        if (err) { return res.status(422).send({ error: err }) }
        res.json(result)
    })
}

export const product_editone = (req, res, next) => {
    Product.findOne({ _id: req.query._id }).exec(function (err, result) {
        if (err) { return res.status(422).send({ error: err }) }
        res.json(result)
    })
}

export const product_create = (req, res, next) => {
    const { productNames, productQuantitys, productDescriptions, imagePath } = req.body
    productHandle(productNames, productQuantitys, productDescriptions, imagePath, null).save(function (err, result) {
        if (err) { return res.status(422).send({ error: err }) }
        res.send({ _id: result.id, status: true })
    })
}

export const product_update = (req, res, next) => {
    const { productNames, productQuantitys, productDescriptions, imagePath, _id } = req.body
    Product.findByIdAndUpdate(_id, { $set: productHandle(productNames, productQuantitys, productDescriptions, imagePath, null, true) }, { upsert: true }, function (err,result) {
        if (err) { return res.status(422).send({ error: err }) }
        res.send({ _id: result.id, status: true })
    })
}

export const product_delete = (req, res, next) => {
    Product.deleteOne({ _id: req.query._id }, function (err) {
        if (err) { return res.status(422).send({ error: err }) }
        res.send({ status: true })
    })
}

export const image_upload = async (req, res, next) => {
    let file = req.file
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    }
    file = new Resize(req.file);
    const bucket = admin.storage().bucket();
    const name = req.body._id + '_' + file.folder.originalname;
    let bucketFile = bucket.file(name)

    if (!file) {
        res.status(401).json({ error: 'Please provide an image' });
    }

    bucketFile = await bucketFile 
        .save(Buffer.from(file.folder.buffer), {
            metadata: { contentType: 'image/jpeg' }}
        ) 
        .then((val) => 
            ({
                status: 'success',
                data: Object.assign({}, bucketFile.metadata, {
                downloadURL: `https://storage.googleapis.com/${bucket.name}/${name}`,
                })
            })
        )
        .catch(err => {
            res.status(500).json({
            status: 'error',
            errors: err,
            });
        });
    Product.findByIdAndUpdate(req.body._id, { '$set': { imagePath: config.firebaseConfig.urlPath + bucketFile.data.name + '?alt=media'} }, { upsert: true }, function (err) {
        if (err) { return res.status(422).send({ error: err }) }
        res.status(200).json({ status: true });
    })
}

export const product_search = (req, res, next) => {
    Product.find({ productName: {$regex : `^${req.query.productName}.*` , $options: 'si' } }, { productDescription: 0 }).exec(function (err, result) {
        if (err) { return res.status(422).send({ error: err }) }
        res.json(result)
    })
}



