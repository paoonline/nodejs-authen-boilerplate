import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { Authen, Product } from './router/'
import mongoose from 'mongoose';
import config from './config'
import cors from 'cors'
import upload from './function/uploadMiddleware'
import * as admin from "firebase-admin";
import serviceAccount from './oauth-242602-firebase-adminsdk-i2kd8-0e90bc1b16'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseConfig.databaseURL,
    storageBucket: config.firebaseConfig.storageBucket
});

const app = express()
// DB setup
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

// App setup

app.use(express.static(__dirname + '/public'));// you can access image 
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('imagePath'))

// Router
Authen(app)

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app)
server.listen(port)
console.log('Server listen on:', port)
