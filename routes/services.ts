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

    response.setHeader('Content-Type', 'application/json');

    if (findAllServices){

        console.log(true)
        response.send(JSON.stringify({ "Message": findAllServices}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "No services found.....!!"}));
});


router.get('/:service_id',  async(request:Request , response:Response)=> {

    const findService = await services.getService(request.params.service_id);

    response.setHeader('Content-Type', 'application/json');
    
    if (findService){

        console.log(true)
        response.send(JSON.stringify({ "Message": findService}));
        return
    }
    console.log(false)
    response.status(404).send(JSON.stringify({ "Error": "There is no such service.....!!"}));
});


router.post('/', async( request :Request, response:Response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const createService = await services.createService(body);

    response.setHeader('Content-Type', 'application/json');

    if (createService){

        console.log(true);
        response.send(JSON.stringify({ "Message": "New service created successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Service not created.....!!"}));
});


router.put('/:service_id' , async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateService = await services.updateService(body, request.params.service_id);

    response.setHeader('Content-Type', 'application/json');

    if (updateService){

        console.log(true);
        response.send(JSON.stringify({ "Message": updateService}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Service not updated.....!!"}));
});


router.patch('/status/:user_id', async(request, response) => {

    const { body } = request;

    const isStatusChanged = await services.changeStatus(body.role_id, request.params.user_id);

    response.setHeader('Content-Type', 'application/json');

    if (isStatusChanged){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The status updated for selected service successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Service status not updated.....!!"}));
});


router.delete('/:service_id', async ( request , response )=>{

    const removeService = await services.deleteService(request.params.service_id);

    response.setHeader('Content-Type', 'application/json');

    if (removeService){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The service deleted successfully......!!"}));
        return

    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Service not deleted.....!!"}));
});



 export function validate( body:any , response:any ){

    response.setHeader('Content-Type', 'application/json');

    let schema = Joi.object({
        name:Joi.string().min(3).max(50).required(),
        description:Joi.string(),
        rate:Joi.string(),
        documents:Joi.array(),
        status:Joi.string().min(1).max(1)
    });

    let { value , error } = schema.validate( body );

    if( error ){
        response.status(400).send(JSON.stringify({ "Error": error.details[0].message }));
        return false
    }

    return true
 }

module.exports = router