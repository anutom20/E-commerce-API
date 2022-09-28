const {StatusCodes} = require('http-status-codes')
const {BadRequestError , NotFoundError , UnauthenticatedError} = require('../errors')
 
const errorHandlerMiddleware = (err,req,res,next)=>{
    let statusCode
    if(err instanceof BadRequestError){
     statusCode = StatusCodes.BAD_REQUEST
    }
    else if(err instanceof NotFoundError){
     statusCode = StatusCodes.NOT_FOUND
    }
    else if(err instanceof UnauthenticatedError){
     statusCode = StatusCodes.UNAUTHORIZED
    }
    else{
     statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    } 


    if(err.name == 'ValidationError'){
        statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.code && err.code == 11000){
        statusCode = StatusCodes.BAD_REQUEST
    }
    res.status(statusCode).json({error:err.message});
}

module.exports = errorHandlerMiddleware