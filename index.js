const express = require('express');
const fs = require('fs')
const helmet = require('helmet');
const morgan = require('morgan');
const  path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors')



const users = require('./routes/users');
const auth = require('./routes/auth');

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


if( !config.get('jwtPrivateKey') ){
    console.error('Fatal Error: JWT secret key is not defined');
    process.exit(1);
}





const app = express();


app.set('view engine' , 'pug');
app.set('views','./views')



app.use( express.json() );
app.use( express.urlencoded({ extended:true }) );
app.use( express.static('public') );
app.use(helmet());
app.use(cors());



if( app.get('env') === 'development' ){
    app.use( morgan('combined',{ stream: accessLogStream  }));
    console.log('Morgan Enabled...')
}


app.get('/' , ( request , response) => {
    response.render('index',{ title:'Swagkari Management' , heading:'Swagkari Management' })
})


app.use('/users' , users );
app.use('/auth' , auth );



const port = process.env.PORT || 3000; 

app.listen( port , () => {   console.log('\x1b[32m%s\x1b[0m', `Server is listening on port ${port}...` ) });

mongoose.connect('mongodb://localhost/swagkari-data')
    .then(() => console.log('\x1b[32m%s\x1b[0m', 'Connected to Database...') )
    .catch( error => console.error('Unable to connect to database.' ,  error ) );

