import { connection } from "../config/db.config";


// import { Schema, model, connect  } from 'mongoose';
// const jwt = require('jsonwebtoken');
// const config = require('config');

// export interface Price{
//     role:string ,
//     price:string,
//     discount:string
// }

// export interface IService{
//    name:string ;
//    rate:number ;
//    bannerImage:string ;
//    description:string ;
//    documents:string[] ;
//    is_active:boolean ;
// }

// export const schema = new Schema<IService>({ 
//     name:{ 
//         type:String,
//         required:true,
//         minlength:3,
//         maxlength:50
//     },
//     rate:Number,
//     bannerImage:String,
//     description:String,
//     documents:[ String ],
//     is_active:{ 
//         type:Boolean,
//         default:true
//     }
// })

//  export const Service = model<IService>('Service' ,  schema );



export class Service{

    constructor( public name:string, public description:string, public rate:number){

    }
}

export class Services{

    async createService(body:any):Promise<boolean> {

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `insert into swagkari.services(name, description, rate) values('${body.name}', '${body.description}', '${body.rate}');`;
            connection.query(query, (error: any, results: any) => {
                    console.log();
                    if( error ) reject( error );

                    resolve( true );
                    }
              );
        })
        return promise
    }

    async updateService(body:any):Promise<boolean>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.services set name='${body.name}', description='${body.description}', rate='${body.rate}' where id='${body.id}' and status='1';`;
            connection.query(query, (error: any, results: any) => {
                    console.log();
                    if( error ) reject( error );

                    resolve( true );
                    }
              );
        })
        return promise
    }

    async getAllService():Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.services where status='1';`;
            connection.query(query, (error: any, results: any) => {
                    console.log();
                    if( error ) reject( error );

                    if( results[0] != undefined ) resolve( true )
                    else resolve( false );
                    }
              );
        })
        return promise
    }

    async getService(id:string):Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `select * from swagkari.services where id='${id}' and status='1';`;
            connection.query(query, (error: any, results: any) => {
                    console.log();
                    if( error ) reject( error );

                    if( results[0] != undefined ) resolve( true )
                    else resolve( false );
                    }
              );
        })
        return promise
    }

    async deleteService(body:any):Promise<boolean>{
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.services set status='0' where id='${body.id}';`;
            connection.query(query, (error: any, results: any) => {
                    console.log();
                    if( error ) reject( error );

                    if( results[0] != undefined ) resolve( true )
                    else resolve( false );
                    }
              );
        })
        return promise
    }
    
}



