import { connection } from "../config/db.config";
import { generateOtp } from "../config/otp.config";

export class User{

    constructor( public mobile:string  ,public otp:string ){

    }

    async isMembership():Promise<boolean>{
        let query = `select * from swagkari.user where mobile='${this.mobile}' and status='1'`;
        console.log( query );
        let promise = new Promise<boolean>( (resolve , reject)=>{
            connection.query( query , ( error:any , results:any ) => {

                if( error ) reject();

                if( results[0] != undefined ) resolve( true )
                else resolve( false );

            })
        })

  

        return promise
    }

    async createMembership( ):Promise<boolean>{
        let promise = new Promise<boolean>(( resolve , reject ) => {
            
            let otp = generateOtp(8);

            connection.query(
                `insert into swagkari.user(mobile, otp) values('${this.mobile}', '${otp}');`,
                (error: any, results: any) => {
                  console.log(otp);
                  if( error ) reject( error );

                  resolve( true );
                }
              );
        })

        return promise
    }

    async sendOtp( ):Promise<boolean>{

        let otp = generateOtp(8);
        let query = `update swagkari.user set otp = '${otp}' where mobile='${this.mobile}';`
        console.log( query );

        let promise = new Promise<boolean>(( resolve , reject ) => {
            connection.query( query ,
                (error: any, results: any) => {
                   if( error ) reject( error )
                   resolve( true );
                }
            );
        })

        return promise
       
    }

    generateToken( ){
        console.log('Generating Token');
    }

    sendToken( ){
        console.log('Sending Token');
    }

    async login( ):Promise<boolean>{

      let query = `select * from swagkari.user where mobile='${this.mobile}' and otp=${this.otp};`
      console.log( query );

       let promise = new Promise<boolean>( ( resolve , reject ) => { 
            if( ! this.otp ) resolve( false );
           
            connection.query( query ,  (error: any, results: any) => {
                if (error) reject( error );
    
                if (results[0] != undefined) resolve( true )
                else resolve( false)
            
            })
        })

       return promise;
    }
}

export class Users extends User{

    async getAllUsers( ):Promise<any>{
        let promise = new Promise<any>((resolve, reject) => {

            const query = `select * from swagkari.user where status='1';`;

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

    async getUser(id:string):Promise<any>{
        let promise = new Promise<any>((resolve, reject) => {

            const query = `select * from swagkari.user where id='${id}' and status='1';`;

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

    async deleteUser(id:string):Promise<boolean> {
        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.user set status='0' where id='${id}';`;

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

    async updateUser(body:any, user_id:string):Promise<boolean>{

        let promise = new Promise<boolean>((resolve, reject) => {

            const query = `update swagkari.user set 
                            fullname='${body.fullname}', 
                            email='${body.email}', 
                            role_id='${body.role_id}',
                            verified='${body.verified}',
                            status='${body.status}'
                            where id='${user_id}'`;
            
            const selectQuery = `select * from swagkari.user where id='${user_id}' and status='1';`;

            console.log(query);
            console.log(selectQuery);
            connection.query(query, (error: any, results: any) => {
                    if( error ) reject( error );

                    connection.query(selectQuery, (error:any, result:any) => {

                        if ( error ) reject( error );
                        console.log(result);
                        resolve( result );
                    });
                    }
              );
        })
        return promise
    }

}