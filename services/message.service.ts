import { Email } from "../models/email";
import { SMS } from "../models/sms";

export class MessageService{

    sendText( text:string , to:string ){
       const sms = new SMS( text , to );
       sms.send()
    }

    sendMail( text:string , to:string , subject?:string  , cc?:string[] , bcc?:string[] ){
       const mail = new Email( text , to , subject , );
       mail.send()
    }

}