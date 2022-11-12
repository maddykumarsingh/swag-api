import express from "express";
import Joi from "joi";
import { User } from "../models/user";

const router = express.Router();
const bcrypt = require("bcrypt");


const req = require("express/lib/request");

router.post("/login", async (request, response) => {
  
  const { body } = request;
  
  if (!validate(body, response)) return;


  let user = new User( body.mobile , body.otp );

  const isMembership:boolean  = await user.isMembership();

    if( isMembership ){
        if( body.otp ){
         const isLoggedIn:boolean =  await user.login();
         if( isLoggedIn ){
           response.send({ token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
           return
         }

          response.status(400).send('Invalid OTP received');
          return
        }
       
      let isSentOtp:boolean = await user.sendOtp()
      if( isSentOtp ) response.status(201).send({message:'OTP has been sent to your registered mobile number'});
      else response.status( 500 ).send('Server is down Please contact your IT adminstration.')
    }
    else{
      let isMembershipCreated:boolean  = await user.createMembership();
      if( isMembershipCreated ) response.status(201).send({ message:'OTP has been sent to your registered mobile number'})
      else response.status( 500 ).send('Server is down Please contact your IT adminstration.')
    }

});

router.post("/logout", async (request, response) => {
  response.status(200).send("Successfully Logout");
});



function validate(body: any, response: any) {
  let schema = Joi.object({
    mobile: Joi.string().trim().min(10).max(10).required(),
    otp: Joi.string().min(8).max(8),
  });

  let { value, error } = schema.validate(body);

  if (error) {
    response.status(400).send(error.details[0].message);
    return false;
  }

  return true;
}

module.exports = router;
