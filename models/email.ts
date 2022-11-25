import SMTPTransport from "nodemailer/lib/smtp-transport";
import { configuration, emailHost } from "../config/email.config";
import { Message } from "./sms";
import nodemailer , { TestAccount , Transporter } from 'nodemailer'

export class Email extends Message{

    constructor( 
        public text:string,
        public to:string,
        public subject?:string,
        public cc?:string[],
        public bcc?:string[],
    ){
        super( text , to )
     }

    send(): void {
        let transporter:Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport( configuration );
        console.log(`Sending Email: ${this.text} to : ${this.to}`);
      
        const mailConfiguration = {
            from:emailHost ,
            to: this.to,
            subject:this.subject,
            text:this.text
        }
    
        transporter.sendMail(mailConfiguration);
    }

}