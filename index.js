import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import router from './router'
import mongoose from 'mongoose';
import config from './config'
const app = express()

// DB setup
mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })

// App setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
router(app)

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app)
server.listen(port)
console.log('Server listen on:', port)
