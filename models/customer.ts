// import { Schema, model } from 'mongoose';
import { connection } from "../config/db.config";
import { User } from './user';



export class Customer extends User{

}


export class Customers{

    async getAllCustomers():Promise<Customer[] | boolean>{
        let promise = new Promise<Customer[] | boolean>((resolve, reject) => {

            const query = `select * from swagkari.customer;`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                console.log( results )
                    if( error ) reject( error );

                    if( results != undefined ){                        
                        return resolve( results )
                    
                    } 
                    else resolve( false );
                    }
              );
        })
        return promise
    }

    async getCustomer(id:string, body:any):Promise<any>{
        
        let promise = new Promise<any>((resolve, reject) => {

            let condition = id == "" ? `mobile=${body.mobile};` : `id='${id}';`;

            const query = `select * from swagkari.customer where ${condition}`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                if( error ) reject( error );

                // console.log(results[0]);
                if( results[0] != undefined ) resolve( results[0] )
                else resolve( false );
                }
              );
        })
        return promise
    }

    async createCustomer(body:any):Promise<any> {

        let promise = new Promise<boolean>(async (resolve, reject) => {

            const isCustomerExists = await this.getCustomer("",body)

            // console.log(isCustomerExists);
            if(!isCustomerExists){
                const query = `insert into swagkari.customer(fullname, mobile, email, DOB, gender, religion, address) 
                            values('${body.fullname}', '${body.mobile}', '${body.email}', '${body.dob}', '${body.gender}', '${body.religion}', '${body.address}');`;

                console.log(query);
                connection.query(query, (error: any, results: any) => {
                        // console.log();
                        if( error ) reject( error );

                        resolve( results ); 
                        }
                );
            }
            else{
                resolve(false);
            }
        })
        return promise
    }

    async updateCustomer(body:any, customer_id:string):Promise<any>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.customer set 
                           fullname='${body.fullname}', 
                           dob='${body.dob}', 
                           gender='${body.gender}',
                           religion='${body.religion}',
                           address='${body.address}'
                           where id='${customer_id}';`;
            
            const selectQuery = `select * from swagkari.customer where id='${customer_id}';`;

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

    async deleteCustomer(customer_id:string):Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `delete from swagkari.customer where id='${customer_id}';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    console.log(results);
                    if( error ) reject( error );

                    // console.log(results.changedRows)
                    if( results.affectedRows != 0 ) resolve( true )
                    else resolve( false );
                    }
              );
        });
        return promise
    }
    
}

