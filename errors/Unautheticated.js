const {StatusCodes} = require('http-status-codes')

class UnautheticatedError extends Error{
    constructor(message){
     super(message)
     this.statusCode =  StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnautheticatedError
