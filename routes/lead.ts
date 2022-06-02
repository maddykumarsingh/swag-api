import express from 'express';
import { auth } from '../middleware/auth';
import { Lead } from '../models/lead';

const router = express.Router()




router.get('/' , auth ,async ( request , response) => {
    const lead = await Lead.find();
    response.send( lead )
})

router.get('/:lead_id', async( request , response )=> {

    let lead_id = request.params.lead_id;
  
    try {
        let lead = await Lead.findById( lead_id );
       
        if( !lead ) return response.status(404).send("The service with the given lead ID was not found ")

        response.send( lead );

    } catch (error) {
        console.error('Error while fetching lead_id /api/services/:lead_id ','\n Error was:', error );
        response.status(500).send('Oops! Something wents wrong.')
    } 

})


router.post('/', async( request , response ) => {
   

    const { body } = request 


    // if( ! validate( body , response ) ) return;
    



   let lead =  new Lead({
       name:body.name,
       document:body.documents,
       price:body.prices
    })

    lead = await lead.save();

    response.status(201).send( lead );

})



router.put('/:lead_id' , async ( request , response ) => {
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


router.delete('/:lead_id', async ( request , response )=>{
    
  const { params , body  } = request

  let lead = await Lead.findByIdAndDelete( params.lead_id  );

    if( ! lead ){
        response.status( 404 ).send("The lead with given ID was not found.");
        return;
    }


    response.status( 200 ).send( lead )

})



module.exports = router