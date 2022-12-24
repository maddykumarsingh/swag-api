import express , { Router , Request , Response } from 'express';
const Joi = require('joi').extend(require('@joi/date'));
import { Leads } from '../models/lead';
// import {  Lead } from '../models/lead';
// import express , { Router , Request , Response } from 'express';
import multer from 'multer';
import { configuration } from '../config/multer.config';
// import { auth } from '../middleware/auth';
// import { Lead } from '../models/lead';
// import { CustomerDocument } from '../models/document';
// import { Customer } from '../models/customer';
const  path = require('path');


const router = Router();

const leads = new Leads();

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


const documentUpload = multer( configuration ).array('');


router.get('/', async ( request:Request , response:Response ) => {

  const allLeads = await leads.getAllLeads();


  if (allLeads){
      response.send(allLeads);
      return
  }
  console.log(false);
  response.status(200).send([]);
});


router.get('/:lead_id', async( request , response )=> {

  const findLead = await leads.getLead(request.params.lead_id);

  response.setHeader('Content-Type', 'application/json');
  
  if (findLead){

      console.log(true)
      response.send(JSON.stringify({ "Message": findLead}));
      return
  }
  console.log(false)
  response.status(404).send(JSON.stringify({ "Error": "There is no such lead.....!!"}));
});

//     let lead_id = request.params.lead_id;
  
//     try {
//         let lead = await Lead.findById( lead_id )
//                              .populate('customer')
//                              .populate('service')
//                              .populate('user')
//                              .exec();
       
//         if( !lead ) return response.status(404).send("The service with the given lead ID was not found ")

//         response.send( lead );

//     } catch (error) {
//         console.error('Error while fetching lead_id /api/services/:lead_id ','\n Error was:', error );
//         response.status(500).send('Oops! Something wents wrong.')
//     } 
    // response.send("The leads for the requested ID is being presented now........!!");
// });


router.post('/', async( request:Request , response:Response ) => {

  const { body } = request;

  if (!validate(body, response)) return;

  // create customer then send the id from result to insert in lead table------->>
  const createLead = await leads.createLead(body);

  response.setHeader('Content-Type', 'application/json');

  if (createLead){

      console.log(true);
      response.send(JSON.stringify({ "Message": "New Lead created successfully......!!"}));
      return
  }
  console.log(false);
  response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Lead not created.....!!"}));
});
//   const { body } = request;

//   if (!validate(body, response)) return;

//   const createService = await services.createService(body);

//   response.setHeader('Content-Type', 'application/json');

//   if (createService){

//       console.log(true);
//       response.send(JSON.stringify({ "Message": "New service created successfully......!!"}));
//       return
//   }
//   console.log(false);
//   response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Service not created.....!!"}));
// ******************
   

//     const { body , files } = request 

//     let customer = new Customer({
//         name: body.name,
//         email:body.email,
//         contact:body.contact
//     })

//      customer = await customer.save()

//     files.map( ( el:any ) => {
//         return new CustomerDocument({ name:'Addhar Card' , file_name:el?.filename  } )
//     });

//     // if( ! validate( body , response ) ) return;

//    let lead =  new Lead({
//        user: request.auth.user_id , 
//        service:body.service_id,
//        customer:customer._id,
//        quoted_rate: body.quoted_rate,
//        remarks:body.remarks ,
//        documents:files.map( ( el:any ) => {
//         return new CustomerDocument({ name:'Addhar Card' , file_name:el?.filename  } )
//         })
//     })

//     lead = await lead.save();

//     response.status(201).send( 'Status done' );

//     response.send("The requested lead is created successfully........!!");
// });



router.put('/:lead_id' , async ( request:Request , response:Response ) => {

  const { body } = request;

  if (!validate(body, response)) return;

  const updateLead = await leads.updateLead(body, request.params.lead_id);

  response.setHeader('Content-Type', 'application/json');

  if (updateLead){

      console.log(true);
      response.send(JSON.stringify({ "Message": updateLead}));
      return
  }
  console.log(false);
  response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Lead not updated.....!!"}));
});
//     const { body , params } = request;

//     // if( ! validate( body , response ) ) return;

//     let lead = await Lead.findByIdAndUpdate( params.lead_id , { 
//         name:body.name , 
//         email:body.email , 
//     } , { new:true } );

//     if( ! lead ){
//         response.status( 404 ).send("The lead with given ID was not found."); 
//         return;
//     }

//     response.send( lead )
// })

// router.delete('/:lead_id', async ( request:Request , response:Response )=>{
    
//   const { params , body  } = request

//   let lead = await Lead.findByIdAndDelete( params.lead_id  );

//     if( ! lead ){
//         response.status( 404 ).send("The lead with given ID was not found.");
//         return;
//     }

//     response.status( 200 ).send( lead )

// response.send("The requested lead is updated successfully........!!");
// });


router.patch('/status/:lead_id', async(request, response) => {

  const { body } = request;

  const isStatusChanged = await leads.changeLeadStatus(request.params.lead_id, body.status);

  response.setHeader('Content-Type', 'application/json');

  if (isStatusChanged){

      console.log(true);
      response.send(JSON.stringify({ "Message": "The status updated for selected Lead successfully......!!"}));
      return
  }
  console.log(false);
  response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Lead status not updated.....!!"}));
});


router.delete('/:lead_id' ,async ( request:Request , response:Response ) => {

  const removeLead = await leads.deleteLead(request.params.lead_id);

  response.setHeader('Content-Type', 'application/json');

  if (removeLead){

      console.log(true);
      response.send(JSON.stringify({ "Message": "The Lead deleted successfully......!!"}));
      return
  }
  console.log(false);
  response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Lead not deleted.....!!"}));
});
  // const lead = await Lead.find();
  // response.send("The requested lead is deleted successfully........!!");
// });




function validate(body: any, response: any) {
    let schema = Joi.object({
        fullname:Joi.string().min(10).max(50).required(),
        mobile: Joi.string().trim().min(10).max(10).required(),
        email:Joi.string().email().max(255),
        dob: Joi.date().format('YYYY-MM-DD'),
        gender: Joi.string().max(6),
        religion: Joi.string().max(20),
        address: Joi.string().max(255),
        rate:Joi.string().max(12),
        remarks:Joi.string(),
        status:Joi.string().min(1).max(1),
        user_id:Joi.string().max(1),
        service_id:Joi.string().max(1)
    });
  
    let { value, error } = schema.validate(body);
  
    if (error) {
      response.status(400).send(JSON.stringify({ "Error": error.details[0].message}));
      return false;
    }
  
    return true;
}

module.exports = router