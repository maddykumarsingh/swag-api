import { Schema, model, connect  } from 'mongoose';
import Joi from 'joi';
const jwt = require('jsonwebtoken');
const config = require('config');



interface Price{
    role:string ,
    price:string,
    discount:string
}

interface IService{
   name:string ,
   prices:Price[],
   documents:string[],
   is_active:boolean 
}


const serviceSchema = new Schema<IService>({ 
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




 const Service = model<IService>('Service' ,  serviceSchema );


 function validate( body:any , response:any ){

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