import express , { Router , Request , Response } from 'express';
import { optional } from 'joi';
const Joi = require('joi').extend(require('@joi/date'));
import { Leads } from '../models/lead';
const router = Router();

const leads = new Leads();




router.get('/', async ( request:Request , response:Response ) => {

  const findAllLeads = await leads.getAllLeads();

  if (findAllLeads){

      console.log(true)
      response.send( findAllLeads );
      return
  }
  console.log(false);
  response.status(404).send({ message: "No Leads found.....!!"});
});


router.get('/:lead_id', async( request , response )=> {

  const findLead = await leads.getLead(request.params.lead_id);
  
  if (findLead){

      console.log(true)
      response.send( findLead );
      return
  }
  console.log(false)
  response.status(404).send({ message: "There is no such lead.....!!"});
});


router.post('/', async( request:Request , response:Response ) => {

  const { body } = request;

  if (!validate(body, response)) return;

  const createLead = await leads.createLead(body);

  if (createLead){

      console.log(true);
      response.send({ message: "New Lead created successfully......!!"});
      return
  }
  console.log(false);
  response.status(404).send({ message: "Oops! Something went wrong..... Lead not created.....!!"});
});


router.put('/:lead_id' , async ( request:Request , response:Response ) => {

  const { body } = request;

  if (!validate(body, response)) return;

  const updateLead = await leads.updateLead(body, request.params.lead_id);

  if (updateLead){

      console.log(true);
      response.send({ message: updateLead});
      return
  }
  console.log(false);
  response.status(404).send({ message: "Oops! Something went wrong..... Lead not updated.....!!"});
});


router.patch('/status/:lead_id', async(request, response) => {

  const { body } = request;

  const isStatusChanged = await leads.changeLeadStatus(request.params.lead_id, body.status);

   

  if (isStatusChanged){

      console.log(true);
      response.send({ message: "The status updated for selected Lead successfully......!!"});
      return
  }
  console.log(false);
  response.status(404).send({ message: "Oops! Something went wrong..... Lead status not updated.....!!"});
});


router.delete('/:lead_id' ,async ( request:Request , response:Response ) => {

  const removeLead = await leads.deleteLead(request.params.lead_id);

   

  if (removeLead){

      console.log(true);
      response.send({ message: "The Lead deleted successfully......!!"});
      return
  }
  console.log(false);
  response.status(404).send({ message: "Oops! Something went wrong..... Lead not deleted.....!!"});
});




function validate(body: any, response: any) {
    let schema = Joi.object({
        fullname:Joi.string().min(10).max(50).required(),
        mobile: Joi.string().trim().min(10).max(10).required(),
        email:Joi.string().email().max(255),
        dob: Joi.date().optional().allow(null).format('YYYY-MM-DD'),
        gender: Joi.string().optional().allow('').max(6),
        religion: Joi.string().optional().allow('').max(20),
        address: Joi.string().optional().allow('').max(255),
        rate_quoted:Joi.string().max(12),
        remarks:Joi.string().optional().allow(''),
        status:Joi.string().optional().allow('').min(1).max(1),
        user_id:Joi.string().max(1).required(),
        service_id:Joi.string().max(1).required()
    });
  
    let { value, error } = schema.validate(body);
  
    if (error) {
      response.status(400).send({ message: error.details[0].message});
      return false;
    }
  
    return true;
}

module.exports = router