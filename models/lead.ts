
import { Schema, model } from 'mongoose';


export type LeadStatus = 'open' | 'closed' | 'ongoing';

export interface ILead{
    service_id:string,
    user_id:string,
    customer_name:string,
    customer_email:string,
    customer_number:string,
    created_date:Date,
    status:LeadStatus
}

export const schema = new Schema<ILead>({
    service_id: Schema.Types.ObjectId,
    user_id:Schema.Types.ObjectId,
    customer_name:String,
    customer_email:String,
    customer_number:String,
    created_date:Date,
    status:{ type:String , enum:[ 'open' , 'closed' , 'ongoing' ] }
})


export const Lead = model('Lead', schema ); 