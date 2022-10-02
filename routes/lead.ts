import express , { Router , Request , Response } from 'express';
import multer from 'multer';
import { configuration } from '../config/multer.config';
import { auth } from '../middleware/auth';
import { Lead } from '../models/lead';
import { CustomerDocument } from '../models/document';
import { Customer } from '../models/customer';
const  path = require('path');


const router = Router();

configuration.storage = multer.diskStorage({
    destination:( request , file , callback:any ) => {
        callback(null , 'public/documents' )
    },
    filename:( request , file , callback:any ) => {
       callback(null , Date.now() + path.extname(file.originalname) )
    }
})

configuration.fileFilter = (request:Request , file:Express.Multer.File , callback:any  ) => {
    var types = /jpeg|png|jpg|pdf/;
    var mimetype = types.test(file.mimetype);
    var extension = types.test(path.extname(file.originalname).toLowerCase());
    
     if( mimetype && extension ){
         return callback( null , true );
     }

 callback(`Error: File upload only supports the following filetypes - ${types}`)
}


const documentUpload = multer( configuration );




router.get('/' ,async ( request:Request , response:Response ) => {
    // const lead = await Lead.find();
    response.send("The leads are being presented now........!!")
})

router.get('/:lead_id', async( request , response )=> {

    let lead_id = request.params.lead_id;
  
    try {
        let lead = await Lead.findById( lead_id )
                             .populate('customer')
                             .populate('service')
                             .populate('user')
                             .exec();
       
        if( !lead ) return response.status(404).send("The service with the given lead ID was not found ")

        response.send( lead );

    } catch (error) {
        console.error('Error while fetching lead_id /api/services/:lead_id ','\n Error was:', error );
        response.status(500).send('Oops! Something wents wrong.')
    } 

})


router.post('/', [ auth, documentUpload.array('documents') ] , async( request:any , response:Response ) => {
   

    const { body , files } = request 



    let customer = new Customer({
        name: body.name,
        email:body.email,
        contact:body.contact
    })

     customer = await customer.save()

    files.map( ( el:any ) => {
        return new CustomerDocument({ name:'Addhar Card' , file_name:el?.filename  } )
    });

    
   

 


    // if( ! validate( body , response ) ) return;
    



   let lead =  new Lead({
       user: request.auth.user_id , 
       service:body.service_id,
       customer:customer._id,
       quoted_rate: body.quoted_rate,
       remarks:body.remarks ,
       documents:files.map( ( el:any ) => {
        return new CustomerDocument({ name:'Addhar Card' , file_name:el?.filename  } )
        })
    })

    lead = await lead.save();

    response.status(201).send( 'Status done' );

})



router.put('/:lead_id' , async ( request:Request , response:Response ) => {
    const { body , params } = request;

    // if( ! validate( body , response ) ) return;


    let lead = await Lead.findByIdAndUpdate( params.lead_id , { 
        name:body.name , 
        email:body.email , 
    } , { new:true } );

    


    if( ! lead ){
        response.status( 404 ).send("The lead with given ID was not found."); 
        return;
    }

    response.send( lead )
})


router.delete('/:lead_id', async ( request:Request , response:Response )=>{
    
  const { params , body  } = request

  let lead = await Lead.findByIdAndDelete( params.lead_id  );

    if( ! lead ){
        response.status( 404 ).send("The lead with given ID was not found.");
        return;
    }


    response.status( 200 ).send( lead )

})



module.exports = router