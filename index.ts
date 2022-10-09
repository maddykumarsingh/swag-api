import express from 'express';
import fs from 'fs'

const cors = require('cors')



const helmet = require('helmet');
const morgan = require('morgan');
const  path = require('path');
const config = require('config');



const auth = require('./routes/auth');
const services = require('./routes/services')

// const users = require('./routes/users');
// const leads = require('./routes/lead')



let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


if( !config.get('jwtPrivateKey') ){
    console.error('Fatal Error: JWT secret key is not defined');
    process.exit(1);
}





const app:express.Application = express();


app.set('view engine' , 'pug');
app.set('views','./views')


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use( express.static('public') );


app.use(helmet());
app.use(cors());



if( app.get('env') === 'development' ){
    app.use( morgan('combined',{ stream: accessLogStream  }));
    console.log('Morgan Enabled...')
}








app.get('/' , ( request:express.Request , response:express.Response ) => {
    response.render('index',{ title:'Swagkari Management' , heading:'Swagkari Management' })
})






// app.use('/users' , users );
app.use('/auth' , auth );
app.use('/services' , services );
// app.use('/leads' , leads );



const port:number | string = process.env.PORT || 3000; 
app.listen( port , () => {   console.log('\x1b[32m%s\x1b[0m', `Server is listening on port ${port}...` ) });

