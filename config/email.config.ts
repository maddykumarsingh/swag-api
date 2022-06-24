import nodemailer , { TestAccount , Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';


// const account = async ():Promise<TestAccount> => {
//     let testAccount:TestAccount = await nodemailer.createTestAccount();
//     return testAccount
// }

const configuration = {
    host:'smtp.ethereal.com',
    port: 587 , 
    secure : false ,
    auth: {
        user: 'domenic.collins9@ethereal.email',
        pass: 'EFebtqACaxsyGMwxkn'
    }
}




export const sendMail = async ( subject:string , to:string[ ] , message:string )=> {
  
    let transporter:Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport( configuration );

    const mailConfiguration = {
        from:'"Nitin Singh" <domenic.collins9@ethereal.email>' ,
        to: to.join(','),
        subject,
        text:message
    }

    return transporter.sendMail(mailConfiguration);

}


