import express, { response, Router } from 'express';
const router:Router = express.Router();
import { Customers } from '../models/customer';
const Joi = require('joi').extend(require('@joi/date'));
import { request } from 'http';



const customer = new Customers();

router.get('/', async ( request , response) => {
    const findAllCustomers = await customer.getAllCustomers();

    if (findAllCustomers){

        console.log(true)
        response.send( findAllCustomers );
        return
    }
    console.log(false);
    response.status(404).send({ message: "No Customers found.....!!" });
});


router.get('/:user_id', async( request , response )=> {

    const findCustomer = await customer.getCustomer(request.params.user_id, "");

    if (findCustomer){

        console.log(true)
        response.send( findCustomer );
        return
    }
    console.log(false)
    response.status(404).send({ message: "No such customer found.....!!" });
});


router.post('/', async( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const isCustomerCreated = await customer.createCustomer(body);

    if(!isCustomerCreated){

        console.log(false)
        response.status(404).send({ message: "Customer already exists.....!!" });
        return
    }
    else if(isCustomerCreated){

        console.log(true)
        response.send({ message: "Customer created successfully..." });
        return
    }
    console.log(false)
    response.status(404).send({ message: "Something went wrong.....!!" });
});


router.put('/:customer_id', async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateUser = await customer.updateCustomer(body, request.params.customer_id);

    if (updateUser){

        console.log(true);
        // response.send(updateUser);
        response.send( updateUser );
        return
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... Customer not updated.....!!"});
});


router.delete('/:customer_id', async ( request , response )=>{

    const deleteUser = await customer.deleteCustomer(request.params.customer_id);

    if (deleteUser){

        console.log(true);
        response.send({ message: "The selected Customer deleted successfully......!!"});
        return
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... Customer not deleted.....!!"});
});





function validate(body: any, response: any) {

    let schema = Joi.object({
        fullname: Joi.string().min(10).max(50).required(),
        mobile: Joi.string().trim().min(10).max(10).required(),
        email: Joi.string().email().max(255),
        dob: Joi.date().format('YYYY-MM-DD'),
        gender: Joi.string().max(6),
        religion: Joi.string().max(20),
        address: Joi.string().max(255)
    });
  
    let { value, error } = schema.validate(body);
  
    if (error) {
      response.status(400).send({ message: error.details[0].message});
      return false;
    }
  
    return true;
}

module.exports = router