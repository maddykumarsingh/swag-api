import { connection } from "../config/db.config";
import { generateOtp } from "../config/otp.config";

export class User{

    constructor( public mobile:string  ,public otp:string ){

    }

    async isMembership():Promise<boolean>{
        let query = `select * from swagkari.user where mobile='${this.mobile}'`;
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