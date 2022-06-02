import express from 'express';
import mongoose from 'mongoose';
import { connectionOptions, mongodbUri } from './config/db.config';
const fs = require('fs')

const multer = require('multer');
const upload = multer();

const helmet = require('helmet');
const morgan = require('morgan');
const  path = require('path');
const config = require('config');
const cors = require('cors')
const fileUpload = require('express-fileupload');



const users = require('./routes/users');
const auth = require('./routes/auth');
const services = require('./routes/services')
const leads = require('./routes/lead')

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


if( !config.get('jwtPrivateKey') ){
    console.error('Fatal Error: JWT secret key is not defined');
    process.exit(1);
}





const app:express.Application = express();


app.set('view engine' , 'pug');
app.set('views','./views')



app.use( express.json() );
app.use( express.urlencoded({ extended:true }) );

app.use(upload.array());
app.use( express.static('public') );


app.use(helmet());
app.use(cors());
app.use(fileUpload());



if( app.get('env') === 'development' ){
    app.use( morgan('combined',{ stream: accessLogStream  }));
    console.log('Morgan Enabled...')
}


app.get('/' , ( request , response) => {
    response.render('index',{ title:'Swagkari Management' , heading:'Swagkari Management' })
})


app.use('/users' , users );
app.use('/auth' , auth );
app.use('/services' , services );
app.use('/leads' , leads );



const port:number | string = process.env.PORT || 3000; 



app.listen( port , () => {   console.log('\x1b[32m%s\x1b[0m', `Server is listening on port ${port}...` ) });

mongoose.connect( mongodbUri , connectionOptions)
    .then(() => console.log('\x1b[32m%s\x1b[0m', 'Connected to Database...') )
    .catch( (error:any) => console.error('Unable to connect to database.' ,  error ) );

