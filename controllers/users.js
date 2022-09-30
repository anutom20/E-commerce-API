const userModel = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')
const {verifyRoles} = require('../middleware/verifyRoles')
const ROLES_LIST = require('../UserRoles/roles_list')

const getAllUsers = async(req,res)=>{
   // allow only admin
    try{
        const Users = await userModel.find({})
        res.status(StatusCodes.OK).json(Users)
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
    }
}

const getSingleUser = async(req,res,next)=>{
     // allow both users and admin
     
     try{
        user_id = req.user.userId
        const User = await userModel.findById(user_id)
        const role = User.userRoles.Admin
        if(!role || role !== ROLES_LIST.Admin){
            req.params.id = user_id
        }
        if(req.params.id !== 'id'){
            const userSearchedByAdmin = await userModel.findById(req.params.id)
            if(!userSearchedByAdmin){
                return res.status(StatusCodes.BAD_REQUEST).json({msg:`User with the id : ${req.params.id} does not exist`})
            }
            return res.status(StatusCodes.OK).json(userSearchedByAdmin)
        }
        res.status(StatusCodes.OK).json({User})
     }
     catch(error){
        console.log(error)
        next(error)
    }

}


module.exports = {
    getAllUsers,
    getSingleUser
}