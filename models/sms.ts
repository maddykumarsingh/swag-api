import { Observable } from "rxjs";

export abstract class Message{
    
    constructor( public text:string , public to:string ){}
    abstract send():void
}


export class SMS extends Message{
    
    send():void{
       console.log(`Sending Text: ${this.text} to : ${this.to} `) 
    }
}