
import { Schema, model } from 'mongoose';
import { ICustomer , schema as customerSchema } from './customer';
import { schema as document } from './document';


export interface IDocuments {
    name:string ;
    file_name:string ;
    uploaded_at:string
}


export type LeadStatus = 'open' | 'closed' | 'ongoing';

export interface ILead{
    service:string,
    user:string ;
    customer:string ;
    quoted_rate?:number
    remarks?:string
    created_date:Date
    documents? :IDocuments[] ;
    status:LeadStatus ;
    isActive:Boolean
}

export const schema = new Schema<ILead>({
    service:{type:Schema.Types.ObjectId , ref:'Service' },
    user:{type:Schema.Types.ObjectId , ref:'User'},
    customer:{type:Schema.Types.ObjectId , ref:'Customer' } ,
    documents:[document] ,
    remarks:String , 
    quoted_rate:Number ,
    created_date:{ type:Date , default:Date.now },
    status:{ type:String , enum:[ 'open' , 'closed' , 'ongoing' ] },
    isActive:{ type:Boolean , default:true }
})


export const Lead = model('Lead', schema ); 