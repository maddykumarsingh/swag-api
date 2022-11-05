import express , { Router , Request , Response } from 'express';
import multer from 'multer';
import { configuration } from '../config/multer.config';
import { auth } from '../middleware/auth';
import { Services } from '../models/service';
import Joi from 'joi';




const router = Router();

const bannerUpload = multer( configuration );


const services = new Services();

router.get('/' ,async (request:Request , response:Response) => {

    const findAllServices = await services.getAllServices();
    if (findAllServices){

        console.log(true)
        response.send(findAllServices);
        return

    }
    console.log(false);
    response.status(404).send("No services found.....!!");
})

router.get('/:service_id',  async(request:Request , response:Response)=> {

    const findService = await services.getService(request.params.service_id);
    
    if (findService){

        console.log(true)
        response.json(findService);
        return

    }
    console.log(false)
    response.status(404).send("There is no such service.....!!");
})

router.post('/', async( request :Request, response:Response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const createService = await services.createService(body);
    if (createService){

        console.log(true);
        response.send("New service created successfully......!!");
        return

    }
    console.log(false);
    response.status(404).send("Oops! Something went wrong..... Service not created.....!!");
});

router.put('/:service_id' , async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateService = await services.updateService(body, request.params.service_id);
    if (updateService){

        console.log(true);
        response.send(updateService);
        return

    }
    console.log(false);
    response.status(404).send("Oops! Something went wrong..... Service not updated.....!!");
});


router.delete('/:service_id', async ( request , response )=>{

    const { body } = request;
  
    if (!validate(body, response)) return;

    const removeService = await services.deleteService(request.params.service_id);
    if (removeService){

        console.log(true);
        response.send("The service deleted successfully......!!");
        return

    }
    console.log(false);
    response.status(404).send("Oops! Something went wrong..... Service not deleted.....!!");
});



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