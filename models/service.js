const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');



const serviceSchema = new mongoose.Schema({ 
    name:{ 
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },

    prices:{
        type:[{ role:String , price:String , discount:String }]
    },

    documents:[ String ],

    is_active:{ 
        type:Boolean,
        default:true
    }
 
})




 const Service = mongoose.model('Service' , mongoose.Schema( serviceSchema ) );


 function validate( body , response  ){

    let schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
    });

    let { value , error } = schema.validate( body );

    if( error ){
        response.status(400).send( error.details[0].message )
        return false
    }

    return true
 }



 module.exports.Service = Service;
 module.exports.schema = serviceSchema;
 module.exports.validate = validate;