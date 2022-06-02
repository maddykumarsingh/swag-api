import express from 'express';
import { auth } from '../middleware/auth';
import { Service, validate } from '../models/service';

const router = express.Router()




router.get('/' , auth ,async ( request , response) => {
    const services = await Service.find();
    response.send( services )
})

router.get('/:service_id', async( request , response )=> {

    let service_id = request.params.service_id;
  
    try {
        let service = await Service.findById( service_id );
       
        if( !service ) return response.status(404).send("The service with the given service ID was not found ")

        response.send( service );

    } catch (error) {
        console.error('Error while fetching user_id /api/services/:service_id ','\n Error was:', error );
        response.status(500).send('Oops! Something wents wrong.')
    } 

})


router.post('/', async( request , response ) => {
   

    const { body } = request 


    if( ! validate( body , response ) ) return;
    



   let service =  new Service({
       name:body.name,
       document:body.documents,
       price:body.prices
    })

    service = await service.save();

    response.status(201).send( service );

})



router.put('/:service_id' , async ( request , response ) => {
    const { body , params } = request;

    if( ! validate( body , response ) ) return;


    let service = await Service.findByIdAndUpdate( params.service_id , { 
        name:body.name , 
        email:body.email , 
    } , { new:true } );

    


    if( ! service ){
        response.status( 404 ).send("The user with given ID was not found."); 
        return;
    }

    response.send( service )
})


router.delete('/:service_id', async ( request , response )=>{
    
  const { params , body  } = request

  let service = await Service.findByIdAndDelete( params.service_id  );

    if( ! service ){
        response.status( 404 ).send("The bug with given ID was not found.");
        return;
    }


    response.status( 200 ).send( service )

})



module.exports = router