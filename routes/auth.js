const express = require('express');
const Joi = require('joi')
const router = express.Router();
const bcrypt = require('bcrypt');

const { User } = require('../models/user');


    router.post('/login', async( request , response ) => {
    

        const { body } = request 


        if( ! validate( body , response ) ) return;
        

        let user  = await User.findOne({ email:body.email });

        if( !user ) return response.status(400).send('Invalid username or password')


        const validPassword = await bcrypt.compare( body.password , user.password );
        if( !validPassword ) return response.status(400).send('Invalid username or password')


        const token = user.generateNewToken();
        
        response.status(200).send( {token} );

    })

    router.post('/logout', async( request , response ) => {

        response.status(200).send('Successfully Logout');

    })

    function validate(body , response) {
        let schema = Joi.object({
            email:Joi.string().email().max(255).required(),
            password:Joi.string().max(255).required()
        });
    
        let { value , error } = schema.validate( body );
    
        if( error ){
            response.status(400).send( error.details[0].message )
            return false
        }
    
        return true
    }


module.exports = router