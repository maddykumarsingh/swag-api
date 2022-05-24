import { Schema, model, connect } from 'mongoose';

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

interface IUser {
    name: string;
    email: string;
    mobile:string;
    password:string;
    role:string;
    createdBy:string;
    is_active:boolean;
    avatar?: string;
}



const userSchema = new Schema<IUser>({ 
    name:{ 
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },

    email:{
        type:String,
        required:true,
        maxlength:255,
        unique:true
    },

    mobile:{
        type:String,
        required:true,
        maxlength:13
    },


    password:{
      type:String,
      required:true,
      maxlength:1024,
    },

    role:{
       type:String,
       enum:[ 'root' , 'superadmin' , 'admin' , 'broker' , 'customer' ],
       default:'customer',
       lowercase:true
    },

    createdBy:String,

    avatar:String,

    is_active:{ 
        type:Boolean,
        default:true
    }
 })

 userSchema.methods.generateNewToken = function(){
    return jwt.sign( { user_id:this._id , name:this.name , email:this.email , role:this.role } , config.get('jwtPrivateKey'));
 }


 const User = model<IUser>('User' , userSchema );


 function validate( body:any , response:any ){

    let schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        email:Joi.string().email().max(255).required(),
        mobile:Joi.string().max(14).required(),
        password:Joi.string().max(255).required(),
        role:Joi.string().max(20)
    });

    let { value , error } = schema.validate( body );

    if( error ){
        response.status(400).send( error.details[0].message )
        return false
    }

    return true
 }



 module.exports.User = User;
 module.exports.schema = userSchema;
 module.exports.validate = validate;