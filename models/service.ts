import { any } from "joi";
import { connection } from "../config/db.config";


export class Service{

    constructor( public name:string, public description:string, public rate:number){
    }
}

export class Services{

    async getAllServices():Promise<any>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.services where status='1';`;

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

    async getService(id:string):Promise<any>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.services where id='${id}' and status='1';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    if( error ) reject( error );

                    //console.log(results[0]);
                    if( results[0] != undefined ) resolve( results )
                    else resolve( false );
                    }
              );
        })
        return promise
    }

    async createService(body:any):Promise<boolean> {

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `insert into swagkari.services(name, description, rate) 
                           values('${body.name}', '${body.description}', '${body.rate}');`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    // console.log();
                    if( error ) reject( error );

                    resolve( true );
                    }
              );
        })
        return promise
    }

    async updateService(body:any, service_id:string):Promise<any>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.services set 
                           name='${body.name}', 
                           description='${body.description}', 
                           rate='${body.rate}',
                           status='${body.status}'
                           where id='${service_id}' and status='1';`;
            
            const selectQuery = `select * from swagkari.services where id='${service_id}' and status='1';`;

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

    async changeStatus(user_id:string, status:string):Promise<boolean>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query  = `update swagkari.service set status = '${status}' where id = '${user_id}'`;

            console.log(query);

            connection.query(query, (error:any, result:any) => {

                if( error ) reject( error );

                if( result.changedRows != 0 ) resolve( true );
                else resolve( false );
            });
        });
        return promise;
    };

    async deleteService(service_id:string):Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `delete from swagkari.services where id='${service_id}';`;

            console.log(query);
            connection.query(query, (error: any, results: any) => {
                    console.log(results);
                    if( error ) reject( error );

                    // console.log(results.changedRows)
                    if( results.changedRows != 0 ) resolve( true )
                    else resolve( false );
                    }
              );
        })
        return promise
    }
    
}



