import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {Authen, Product} from './router/'
import mongoose from 'mongoose';
import config from './config'
import cors from 'cors'
const app = express()

// DB setup
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })

// App setup
app.use(express.static(__dirname + '/public'));// you can access image 
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Router
Authen(app)
Product(app)

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app)
server.listen(port)
console.log('Server listen on:', port)
