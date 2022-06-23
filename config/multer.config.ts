import multer = require('multer');
import express from 'express'
const  path = require('path');


export const storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
      cb(null, 'public/documents')
    },
    filename: function (req:any, file:any, cb:any) {
       cb(null,Date.now()+".jpg")
    }
})

const fileMaximumSize = 1 * 1000 * 1000;


export const configuration = { 
   storage ,
   limits:{ fileSize:fileMaximumSize } ,
   fileFilter( request:express.Request , file:Express.Multer.File , callback:any ){
       var types = /jpeg|png|jpg/;
       var mimetype = types.test(file.mimetype);
       var extension = types.test(path.extname(file.originalname).toLowerCase());
       
        if( mimetype && extension ){
            return callback( null , true );
        }

    callback(`Error: File upload only supports the following filetypes - ${types}`)

   }
}

