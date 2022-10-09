import express, { response } from "express";
import Joi from "joi";
const router = express.Router();
const bcrypt = require("bcrypt");
import nodemailer from "nodemailer";
import { config } from "process";
import { sendMail } from "../config/email.config";
import connection = require("../config/db.config");
const otpGenerator = require("otp-generator");

const { User } = require("../models/user");
const req = require("express/lib/request");

router.post("/login", async (request, response) => {
  const { body } = request;
  if (!validate(body, response)) return;

  const Connection: any = connection;
  // if mobile and otp is present
  if (request.body.mobile != null && request.body.otp != null) {
    try {
      Connection.query(
        `select * from swagkari.user where mobile='${request.body.mobile}' and otp=${request.body.otp};`,
        (error: any, results: any) => {
          if (error) throw error;

          if (results[0] != undefined) {
            response.send("Logged in successfully");
          }else{
            response.send("invalid otp....!!");
          }
        }
      );
    } catch (error) {
      response.send("Log in unsuccessful");
      throw error;
    }
  } else {
    // if only mobile is present
    try {
      Connection.query(
        `select * from swagkari.user where mobile='${request.body.mobile}';`,
        (error: any, results: any) => {
          if (error) throw error;

          const otp = otpGenerator.generate(8, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
          });
          // if mobile is already registered
          if (results[0] != undefined) {
            if (results[0].mobile == request.body.mobile) {
              Connection.query(
                `update swagkari.user set otp = '${otp}' where mobile='${request.body.mobile}';`,
                (error: any, results: any) => {
                  console.log(otp);
                  response.send(
                    "otp sent successfully for already registered customer...."
                  );
                }
              );
            }
          } else {
            // if new mobile is found
            Connection.query(
              `insert into swagkari.user(mobile, otp) values('${request.body.mobile}', '${otp}');`,
              (error: any, results: any) => {
                console.log(otp);
                response.send(
                  "otp sent successfully for newly registered customer...."
                );
              }
            );
          }
        }
      );
    } catch (error) {
      response.send("can not send otp");
      throw error;
    }
  }

  //let user  = await User.findOne({ email:body.mobile });

  // if( !user ) return response.status(400).send('Invalid username or password')

  // const validPassword = await bcrypt.compare( body.password , user.password );
  // if( !validPassword ) return response.status(400).send('Invalid username or password')

  // const token = user.generateNewToken();
  // response.header('x-auth-token', token );
  // response.cookie('x-auth-token', token );
  // response.status(200).send( {token} );
  //   response.send("Done......!!");
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
