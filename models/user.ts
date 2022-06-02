import { Model , Schema, model  } from 'mongoose';

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

export interface IUser {
    name: string;
    email: string;
    mobile:string;
    password:string;
    role:string;
    createdBy:string;
    is_active:boolean;
    avatar?: string;
}

// Put all user instance methods in this interface:
export interface IUserMethods {
    generateNewToken(): string;
}


// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, {}, IUserMethods>;



export const schema = new Schema<IUser , UserModel , IUserMethods>({ 
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

 schema.methods.generateNewToken = function(){
    return jwt.sign( { user_id:this._id , name:this.name , email:this.email , role:this.role } , config.get('jwtPrivateKey'));
 }


 export const User = model<IUser, UserModel>( 'User' , schema )


 export function validate( body:any , response:any ):boolean{

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
