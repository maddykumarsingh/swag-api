import { Schema, model, connect  } from 'mongoose';
import Joi from 'joi';
const jwt = require('jsonwebtoken');
const config = require('config');



export interface Price{
    role:string ,
    price:string,
    discount:string
}

export interface IService{
   name:string ;
   rate:number ;
   bannerImage:string ;
   description:string ;
   documents:string[] ;
   is_active:boolean ;
}


export const schema = new Schema<IService>({ 
    name:{ 
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    rate:Number,
    bannerImage:String,
    description:String,
    documents:[ String ],
    is_active:{ 
        type:Boolean,
        default:true
    }
})




 export const Service = model<IService>('Service' ,  schema );


 export function validate( body:any , response:any ){

    let schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        description:Joi.string() ,
        rate:Joi.string(),
        documents:Joi.array()
    });

    let { value , error } = schema.validate( body );

    if( error ){
        response.status(400).send( error.details[0].message )
        return false
    }

    return true
 }



