import { Schema, model } from 'mongoose';

export interface ICustomer{
    name:string,
    email:string,
    contact:string,
    is_active?:boolean,
    head_user?: string
}


export const schema  = new Schema<ICustomer>({
    name:String,
    email:String,
    contact:String,
    is_active:{ type:Boolean , default: true },
    head_user:{type:Schema.Types.ObjectId , ref:'User'}
})

export const Customer = model<ICustomer>('Customer' , schema );

