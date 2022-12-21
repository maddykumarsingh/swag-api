// import { Schema, model } from 'mongoose';
// import { ICustomer , schema as customerSchema } from './customer';
// import { schema as document } from './document';
import { connection } from "../config/db.config";
import { Customers } from "./customer";



export class Lead{

    constructor(){};
    
}


export class Leads{

    async getAllLeads():Promise<any>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.leads where status='1';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    // console.log(results);
                    if( error ) reject( error );

                    if( results != undefined ) resolve( results )
                    else resolve( false );
                    }
              );
        })
        return promise
    }


    async getLead(id:string):Promise<any>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.leads where id='${id}' and status='1';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    if( error ) reject( error );

                    //console.log(results[0]);
                    if( results[0] != undefined ) resolve( results[0] )
                    else resolve( false );
                    }
              );
        })
        return promise
    }


    async createLead(body:any):Promise<boolean> {

        let promise = new Promise<boolean>(async (resolve, reject) => {

            const customer = new Customers();

            let customer_id;
            let isCustomerExist;

            try{ 
                isCustomerExist = await customer.getCustomer("", body);
                console.log('Customer Exits', isCustomerExist )
            }
            catch ( error ) {
                console.log( error );
                reject( error );
            }

            
            if( isCustomerExist ){

                const isCustomerCreated = await customer.createCustomer(body);
                const newCustomer = await customer.getCustomer("", body);
                customer_id = newCustomer[0].id;
            }
            else{

                customer_id = isCustomerExist[0].id;
            }

            const query = `insert into swagkari.leads(user_id, service_id, customer_id, rate, remarks) 
                           values('${body.user_id}', '${body.service_id}', '${customer_id}', '${body.rate}', '${body.remarks}');`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    // console.log();
                    if( error ) reject( error );

                    if( results != undefined ) resolve( results )
                    else resolve( false );
                    }
              );
        })
        return promise
    }


    async updateLead(body:any, lead_id:string):Promise<any>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.leads set 
                           rate='${body.rate}', 
                           remarks='${body.remarks}',
                           status='${body.status}'
                           where id='${lead_id}';`;
            
            const selectQuery = `select * from swagkari.leads where id='${lead_id}';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    if( error ) reject( error );

                    connection.query(selectQuery, (error:any, result:any) => {

                        if ( error ) reject( error );
                        resolve( result );
                    });
                    }
              );
        })
        return promise
    }


    async changeLeadStatus(lead_id:string, status:string):Promise<boolean>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query  = `update swagkari.leads set status = '${status}' where id = '${lead_id}'`;

            console.log(query);

            connection.query(query, (error:any, result:any) => {

                if( error ) reject( error );

                if( result.changedRows != 0 ) resolve( true );
                else resolve( false );
            });
        });
        return promise;
    }


    async deleteLead(lead_id:string):Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `delete from swagkari.leads where id='${lead_id}';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    console.log(results);
                    if( error ) reject( error );

                    // console.log(results.changedRows)
                    if( results.affectedRows != 0 ) resolve( true )
                    else resolve( false );
                    }
              );
        })
        return promise
    }

}


// export interface IDocuments {
    // name:string ;
    // file_name:string ;
    // uploaded_at:string
// }


// export type LeadStatus = 'open' | 'closed' | 'ongoing';

// export interface ILead{
//     service:string,
//     user:string ;
//     customer:string ;
//     quoted_rate?:number
//     remarks?:string
//     created_date:Date
//     documents? :IDocuments[] ;
//     status:LeadStatus ;
//     isActive:Boolean
// }

// export const schema = new Schema<ILead>({
//     service:{type:Schema.Types.ObjectId , ref:'Service' },
//     user:{type:Schema.Types.ObjectId , ref:'User'},
//     customer:{type:Schema.Types.ObjectId , ref:'Customer' } ,
//     documents:[document] ,
//     remarks:String , 
//     quoted_rate:Number ,
//     created_date:{ type:Date , default:Date.now },
//     status:{ type:String , enum:[ 'open' , 'closed' , 'ongoing' ] },
//     isActive:{ type:Boolean , default:true }
// })


// export const Lead = model('Lead', schema ); 