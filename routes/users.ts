import express, { response, Router } from 'express';
const router:Router = express.Router();
import { User, Users } from '../models/user';
import Joi from 'joi';
import { request } from 'http';


const users = new Users("", "");

router.get('/', async ( request , response) => {
    const usersList = await users.getAllUsers();

    if (usersList){

        console.log(true)
        // response.send(findAllUsers);
        response.send( usersList );
        return
    }
    console.log(false);
    // response.status(404).send("No users found.....!!");
    response.status(404).send({ message: "No users found.....!!" });
});


router.get('/:user_id', async( request , response )=> {

    const findUser = await users.getUser(request.params.user_id);

    if (findUser){

        console.log(true)
        // response.json(findUser);
        response.send( findUser );
        return

    }
    console.log(false)
    // response.status(404).send("No such user found.....!!");
    response.status(404).send({ message: "No such user found.....!!" });
});


router.post('/', async( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    let user = new User( body.mobile , body.otp );

    const isMembership:boolean  = await user.isMembership();

    if( !isMembership ){
        let isMembershipCreated:boolean  = await user.createMembership();

        if( isMembershipCreated ) {

            let isSentOtp:boolean = await user.sendOtp()
            if( isSentOtp ) response.send({ message: "New user created successfully. OTP has been sent to your registered mobile number..." });
            else response.status( 400 ).send({ message: "Server is down Please contact your IT adminstration." });
            return;
        }
    }
    else{
        let isSentOtp:boolean = await user.sendOtp()
        if( isSentOtp ) response.send({ message: "Existing user. OTP has been sent to your registered mobile number..." });
        else response.status( 500 ).send({ message: "Server is down Please contact your IT adminstration." });
        return;
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... User not created.....!!" });
});


router.put('/:user_id', async ( request , response ) => {

    const { body } = request;
  
    if (!validate(body, response)) return;

    const updateUser = await users.updateUser(body, request.params.user_id);

    if (updateUser){

        console.log(true);
        // response.send(updateUser);
        response.send({ message: updateUser });
        return

    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... User not updated.....!!"});
});


router.patch('/block/:user_id', async(request, response) => {

    const { body } = request;

    const isBlocked = await users.changeStatus(request.params.user_id, body.userStatus);

    if (isBlocked){

        console.log(true);
        response.send({ message: "The selected user blocked successfully......!!"});
        return
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... OR Seems user does not exists.....!!"});
});


router.patch('/role/:user_id', async(request, response) => {

    const { body } = request;

    const isRoleChanged = await users.changeRole(body.role_id, request.params.user_id);

    if (isRoleChanged){

        console.log(true);
        response.send({ message: "The role updated for selected user successfully......!!"});
        return
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... Role can not be updated.....!!"});
});


router.delete('/:user_id', async ( request , response )=>{

    const deleteUser = await users.deleteUser(request.params.user_id);

    if (deleteUser){

        console.log(true);
        response.send({ message: "The selected user deleted successfully......!!"});
        return
    }
    console.log(false);
    response.status(404).send({ message: "Oops! Something went wrong..... user not deleted.....!!"});
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
      response.status(400).send({ message: error.details[0].message});
      return false;
    }
  
    return true;
}

module.exports = router