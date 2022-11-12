import express from "express";
import Joi from "joi";
import { User } from "../models/user";
var jwt = require('jsonwebtoken');
const config = require('config');



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
            let token = jwt.sign({ id:1, name:'Nitin Singh',email:'' } ,'Swagkari@2022')
            response.send({ token })
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
    otp: Joi.string().min(6).max(6),
  });

  let { value, error } = schema.validate(body);

  if (error) {
    response.status(400).send(error.details[0].message);
    return false;
  }

  return true;
}

module.exports = router;
