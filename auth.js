"use strict";
const jwt=require('jsonwebtoken');
// import { NextFunction } from 'express';
// import * as config from '../config/constant';
// import * as envSecret from '../config/environment'


exports.validateToken = (req,res,next) => {

const authorizationHeader = req.headers.authorization;
console.log(authorizationHeader,"<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>><<<<")
if (authorizationHeader) {
const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
console.log(token,"KIIIIIIIIIIIIIIII");
try {
// verify makes sure that the token hasn't expired and has been issued by us
let result = jwt.verify(token, "krishna");
console.log(result,"resultresultresultresultresultresult");

// Let's pass back the decoded token to the request object

req.token = result;

// We call next to pass execution to the subsequent middleware
next();

} catch (err) {
// Throw an error just in case anything goes wrong with verification
throw new Error(err);
}
} else {

res.send("INVALID_TOKEN");
}
}













