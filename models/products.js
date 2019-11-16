import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Define our model
const productSchema = new Schema({
    productName: { type: String, required: true, unique: true },
    productModify: { type: Date, required: true },
    productQuantity: { type: Number, required: true },
    productDescription: { type: String, required: true },
    imagePath: { type: String, default: '' }
})

// Create the model class
const ModelClass = mongoose.model('product', productSchema)

//Export the moel
export default ModelClass