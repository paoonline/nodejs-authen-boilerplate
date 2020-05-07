import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
const Schema = mongoose.Schema

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// Define our model
const userCompanySchema = new Schema({
    email: { 
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'], 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {type: String, required: true, minlength: 8 , maxlength: 15},
    ownName: {type: String, required: true, minlength: 1 , maxlength: 20},
    companyName: {type: String, required: true, minlength: 1 , maxlength: 20},
    companyAddress: {type: String, required: true, minlength: 1 , maxlength: 100},
    isActive: {type: Boolean , default: false},
    date: {type : Date, default: Date.now }
})

// On save hook, encrypt password
// Before save a model, run this function

userCompanySchema.pre('save', function (next) {
    const user = this

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err) }

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) { return next(err) }

            // overwrite plain text password with encrypted password
            user.password = hash
            next()
        })
    })
})

userCompanySchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) { return callback(err) }
        callback(null, isMatch)
    })
}

// Create the model class
const ModelClass = mongoose.model('userCompany', userCompanySchema)

//Export the moel
export default ModelClass