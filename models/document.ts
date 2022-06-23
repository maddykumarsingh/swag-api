import { Schema, model } from 'mongoose';

export interface IDocuments {
    name:string ;
    file_name:string ;
    uploaded_at:Date
}

export const schema  = new Schema<IDocuments>({
    name:String,
    file_name:String,
    uploaded_at:{ type: Date , default:Date.now }
})

export const CustomerDocument = model('Document' , schema )

