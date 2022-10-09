import express , { Router , Request , Response } from 'express';
import multer from 'multer';
import { configuration } from '../config/multer.config';
import { auth } from '../middleware/auth';
import { Service, Services } from '../models/service';
import Joi from 'joi';




const router = Router();

// configuration.storage = multer.diskStorage({
//     destination:( request , file , callback:any ) => {
//         callback(null , 'public/banner-image' )
//     },
//     filename:( request , file , callback:any ) => {
//        callback(null , Date.now()+".jpg" )
//     }
// })

const bannerUpload = multer( configuration );


const services = new Services();

router.get('/' ,async (request:Request , response:Response) => {
    const findAllServices = await services.getAllService();
    if (findAllServices){

        console.log(findAllServices);
        response.send("You have all the requested services......!!");
        return

    }

    console.log(findAllServices);
    response.status(404).send("No services found.....!!");
})

router.get('/:service_id',  async(request:Request , response:Response)=> {
    const findService = await services.getService(request.params.service_id);
    if (findService){

        console.log(findService);
        response.send("You have the requested service......!!");
        return

    }

    console.log(findService);
    response.status(404).send("No services found.....!!");

    // let service_id = request.params.service_id;
  
    // try {
    //     let service = await Service.findById( service_id );
       
    //     if( !service ) return response.status(404).send("The service with the given service ID was not found ")

    //     response.send( service );

    // } catch (error) {
    //     console.error('Error while fetching user_id /api/services/:service_id ','\n Error was:', error );
    //     response.status(500).send('Oops! Something wents wrong.')
    // } 

})

router.post('/', auth ,  async( request :Request, response:Response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    // let service = new Service( body.name, body.description, body.rate );
    const createService = await services.createService(body);
    if (createService){

        console.log(createService);
        response.send("New service created......!!");
        return

    }

    console.log(createService);
    response.status(404).send("Service not created.....!!");
})

// router.post('/', [auth , bannerUpload.single('banner_image')] ,  async( request :Request, response:Response ) => {
   

//     const { body , file } = request 

//     if( ! validate( body , response ) ) return;

//    let service =  new Service({
//        name:body.name,
//        documents:body.documents,
//        rate:body.rate ,
//        description:body.description ,
//        bannerImage:file?.filename
//     })

    // service = await service.save();

    //response.status(201).send( service );

    // response.json( service )
// })



router.put('/:service_id' , async ( request , response ) => {
    // const { body , params } = request;

    // if( ! validate( body , response ) ) return;


    // let service = await Service.findByIdAndUpdate( params.service_id , { 
    //     name:body.name , 
    //     email:body.email , 
    // } , { new:true } );

    


    // if( ! service ){
    //     response.status( 404 ).send("The user with given ID was not found."); 
    //     return;
    // }

    // response.send( service )
})


router.delete('/:service_id', async ( request , response )=>{
    
//   const { params , body  } = request

//   let service = await Service.findByIdAndDelete( params.service_id  );

//     if( ! service ){
//         response.status( 404 ).send("The bug with given ID was not found.");
//         return;
//     }


//     response.status( 200 ).send( service )

})



 export function validate( body:any , response:any ){

    let schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        description:Joi.string(),
        rate:Joi.string(),
        documents:Joi.array()
    });

    let { value , error } = schema.validate( body );

    if( error ){
        response.status(400).send( error.details[0].message )
        return false
    }

    return true
 }

module.exports = router