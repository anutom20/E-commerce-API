const {StatusCodes} = require('http-status-codes')
const {BadRequestError , NotFoundError , UnauthenticatedError} = require('../errors')
 
const errorHandlerMiddleware = (err,req,res,next)=>{
    let statusCode
    let msg = 'Something went wrong , please try again!'
    if(err instanceof BadRequestError){
     statusCode = StatusCodes.BAD_REQUEST
     msg = err.message
    }
    else if(err instanceof NotFoundError){
     statusCode = StatusCodes.NOT_FOUND
     msg = err.message
    }
    else if(err instanceof UnauthenticatedError){
     statusCode = StatusCodes.UNAUTHORIZED
     msg = err.message
    }
    else{
     statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    } 


    if(err.name == 'ValidationError'){
        statusCode = StatusCodes.BAD_REQUEST
        msg = err.message
    }
    if(err.name == 'CastError'){
        statusCode = StatusCodes.BAD_REQUEST
        msg = 'Cast Error Mongoose'
    }
    if(err.code && err.code == 11000){
        statusCode = StatusCodes.BAD_REQUEST
        msg = 'Email already exists!'
    }
    console.log(err)
    res.status(statusCode).json({error:msg});
}

module.exports = errorHandlerMiddleware