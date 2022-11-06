import express, { response, Router } from 'express';
const router:Router = express.Router();
import { User, Users } from '../models/user';
import Joi from 'joi';
import { request } from 'http';

// import { auth } from '../middleware/auth';
// import nodmailer from 'nodemailer'
// const bcrypt = require('bcrypt');


// const { pick } = require('../helpers/pick');

const users = new Users("", "");

router.get('/', async ( request , response) => {
    const findAllUsers = await users.getAllUsers();

    response.setHeader('Content-Type', 'application/json');

    if (findAllUsers){

        console.log(true)
        // response.send(findAllUsers);
        response.send(JSON.stringify({ "Message": findAllUsers }));
        return
    }
    console.log(false);
    // response.status(404).send("No users found.....!!");
    response.status(404).send(JSON.stringify({ "Error": "No users found.....!!" }));
});


router.get('/:user_id', async( request , response )=> {

    const findUser = await users.getUser(request.params.user_id);
    
    response.setHeader('Content-Type', 'application/json');

    if (findUser){

        console.log(true)
        // response.json(findUser);
        response.send(JSON.stringify({ "Message": findUser }));
        return

    }
    console.log(false)
    // response.status(404).send("No such user found.....!!");
    response.status(404).send(JSON.stringify({ "Error": "No such user found.....!!" }));
});


router.post('/', async( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    let user = new User( body.mobile , body.otp );

    const isMembership:boolean  = await user.isMembership();

    response.setHeader('Content-Type', 'application/json');

    if( !isMembership ){
        let isMembershipCreated:boolean  = await user.createMembership();

        if( isMembershipCreated ) {

            let isSentOtp:boolean = await user.sendOtp()
            if( isSentOtp ) response.send(JSON.stringify({ "Message": "New user created successfully. OTP has been sent to your registered mobile number..." }));
            else response.status( 400 ).send(JSON.stringify({ "Error": "Server is down Please contact your IT adminstration." }));
            return;
        }
    }
    else{
        let isSentOtp:boolean = await user.sendOtp()
        if( isSentOtp ) response.send(JSON.stringify({ "Message": "Existing user. OTP has been sent to your registered mobile number..." }));
        else response.status( 500 ).send(JSON.stringify({ "Error": "Server is down Please contact your IT adminstration." }));
        return;
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... User not created.....!!" }));
});


router.put('/:user_id', async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateUser = await users.updateUser(body, request.params.user_id);

    response.setHeader('Content-Type', 'application/json');

    if (updateUser){

        console.log(true);
        // response.send(updateUser);
        response.send(JSON.stringify({ "Message": updateUser }));
        return

    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... User not updated.....!!"}));
});


router.patch('/block/:user_id', async(request, response) => {

    const { body } = request;

    const isBlocked = await users.changeStatus(request.params.user_id, body.userStatus);

    response.setHeader('Content-Type', 'application/json');

    if (isBlocked){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The selected user blocked successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... OR Seems user does not exists.....!!"}));
});


router.patch('/role/:user_id', async(request, response) => {

    const { body } = request;

    const isRoleChanged = await users.changeRole(body.role_id, request.params.user_id);

    response.setHeader('Content-Type', 'application/json');

    if (isRoleChanged){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The role changed for selected user successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... Role not changed.....!!"}));
});


router.delete('/:user_id', async ( request , response )=>{

    const deleteUser = await users.deleteUser(request.params.user_id);

    response.setHeader('Content-Type', 'application/json');

    if (deleteUser){

        console.log(true);
        response.send(JSON.stringify({ "Message": "The selected user deleted successfully......!!"}));
        return
    }
    console.log(false);
    response.status(404).send(JSON.stringify({ "Error": "Oops! Something went wrong..... user not deleted.....!!"}));
});





function validate(body: any, response: any) {
    let schema = Joi.object({
      mobile: Joi.string().trim().min(10).max(10).required(),
      otp: Joi.string().min(8).max(8),
      fullname:Joi.string().min(10).max(50),
      email:Joi.string().email(),
      role_id:Joi.string().min(1).max(2),
      verified:Joi.string().min(1).max(2),
      status:Joi.string().min(1).max(1),
    });
  
    let { value, error } = schema.validate(body);
  
    if (error) {
      response.status(400).send(error.details[0].message);
      return false;
    }
  
    return true;
}

module.exports = router