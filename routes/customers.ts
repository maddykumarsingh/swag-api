import express, { response, Router } from 'express';
const router:Router = express.Router();
import { Customers } from '../models/customer';
const Joi = require('joi').extend(require('@joi/date'));
import { request } from 'http';

// import { auth } from '../middleware/auth';
// import nodmailer from 'nodemailer'
// const bcrypt = require('bcrypt');


// const { pick } = require('../helpers/pick');

const customer = new Customers();

router.get('/', async ( request , response) => {
    const findAllCustomers = await customer.getAllCustomers();

    response.setHeader('Content-Type', 'application/json');

    if (findAllCustomers){

        console.log(true)
        response.send(JSON.stringify({ "Message": findAllCustomers }));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "No Customers found.....!!" }));
});


router.get('/:user_id', async( request , response )=> {

    const findCustomer = await customer.getCustomer(request.params.user_id, "");
    
    response.setHeader('Content-Type', 'application/json');

    if (findCustomer){

        console.log(true)
        response.send(JSON.stringify({ "Message": findCustomer }));
        return
    }
    console.log(false)
    response.status(404).send(JSON.stringify({ "Error": "No such customer found.....!!" }));
});


router.post('/', async( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    console.log( body );
    const isCustomerCreated = await customer.createCustomer(body);

    if(!isCustomerCreated){

        console.log(false)
        response.status(404).send(JSON.stringify({ "Error": "Customer already exists.....!!" }));
        return
    }
    else if(isCustomerCreated){

        console.log(true)
        response.send(JSON.stringify({ "Message": isCustomerCreated }));
        return
    }
    console.log(false)
    response.status(404).send(JSON.stringify({ "Error": "Something went wrong.....!!" }));
});


router.put('/:customer_id', async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateUser = await customer.updateCustomer(body, request.params.customer_id);

    response.setHeader('Content-Type', 'application/json');

    if (updateUser){

        console.log(true);
        // response.send(updateUser);
        response.send(JSON.stringify({ "Message": updateUser }));
        return

    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Customer not updated.....!!"}));
});


// router.patch('/block/:user_id', async(request, response) => {

//     const { body } = request;

//     const isBlocked = await customer.changeStatus(request.params.user_id, body.userStatus);

//     response.setHeader('Content-Type', 'application/json');

//     if (isBlocked){

//         console.log(true);
//         response.send(JSON.stringify({ "Message": "The selected user blocked successfully......!!"}));
//         return
//     }
//     console.log(false);
//     response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... OR Seems user does not exists.....!!"}));
// });


// router.patch('/role/:user_id', async(request, response) => {

//     const { body } = request;

//     const isRoleChanged = await users.changeRole(body.role_id, request.params.user_id);

//     response.setHeader('Content-Type', 'application/json');

//     if (isRoleChanged){

//         console.log(true);
//         response.send(JSON.stringify({ "Message": "The role updated for selected user successfully......!!"}));
//         return
//     }
//     console.log(false);
//     response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Role can not be updated.....!!"}));
// });


router.delete('/:customer_id', async ( request , response )=>{

    const deleteUser = await customer.deleteCustomer(request.params.customer_id);

    response.setHeader('Content-Type', 'application/json');

    if (deleteUser){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The selected Customer deleted successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Customer not deleted.....!!"}));
});





function validate(body: any, response: any) {
    let schema = Joi.object({
        fullname: Joi.string().min(10).max(50).required(),
        mobile: Joi.string().trim().min(10).max(10).required(),
        email: Joi.string().optional().allow('').email().max(255),
        dob: Joi.date().optional().allow('').format('YYYY-MM-DD'),
        gender: Joi.string().optional().allow('').max(6),
        religion: Joi.string().optional().allow('').max(20),
        address: Joi.string().optional().allow('').max(255)
    });
  
    let { value, error } = schema.validate(body);
  
    if (error) {
      response.status(400).send(JSON.stringify({ "Error": error.details[0].message}));
      return false;
    }
  
    return true;
}

module.exports = router