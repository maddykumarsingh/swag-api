import express, { Router } from 'express';
import { auth } from '../middleware/auth';
import { User, validate } from '../models/user';
import nodmailer from 'nodemailer'
const bcrypt = require('bcrypt');

const router:Router = express.Router()

const { pick } = require('../helpers/pick');


router.get('/'  , async ( request , response) => {
    //const users = await User.find().select('-password -__v');
    response.send("You are viewing users now")
})

router.get('/:user_id', async( request , response )=> {

    let user_id = request.params.user_id;
  
    try {
        let user = await User.findById( user_id );
       
        if( !user ) return response.status(404).send("The user with the given user ID was not found ")

        response.send( user );

    } catch (error) {
        console.error('Error while fetching user_id /api/users/:userid ','\n Error was:', error );
        response.status(500).send('Oops! Something wents wrong.')
    } 

})


router.post('/', async( request , response ) => {
   

    const { body } = request 


    if( ! validate( body , response ) ) return;
     

    let user  = await User.findOne({ email:body.email })

    if( user ) return response.status(400).send('User already register.')




    user =  new User({
       name:body.name,
       email:body.email,
       password:body.password,
       mobile:body.mobile,
       role:body.role
    })

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( user.password , salt );
    


    user = await user.save();



    const token = user.generateNewToken();
    response.header('x-jwt-token',token ).status(201).send( user );

})



router.put('/:user_id' , async ( request , response ) => {
    const { body , params } = request;

    if( ! validate( body , response ) ) return;


    let user = await User.findByIdAndUpdate( params.user_id , { 
        name:body.name , 
        email:body.email , 
    } , { new:true } );

    


    if( ! user ){
        response.status( 404 ).send("The user with given ID was not found."); 
        return;
    }

   

   

    response.send( user )
})


router.delete('/:user_id', async ( request , response )=>{
    
  const { params , body  } = request

  let user = await User.findByIdAndDelete( params.user_id  );

    if( ! user ){
        response.status( 404 ).send("The bug with given ID was not found.");
        return;
    }


    response.status( 200 ).send( user )

})



module.exports = router