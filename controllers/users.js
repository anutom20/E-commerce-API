const userModel = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../errors')
const ROLES_LIST = require('../UserRoles/roles_list')

const getAllUsers = async(req,res)=>{
   // allow only admin

        const Users = await userModel.find({})
        res.status(StatusCodes.OK).json(Users)
    
}

const getSingleUser = async(req,res)=>{
     // allow both users and admin
     
     
        user_id = req.user.userId
        const User = await userModel.findById(user_id)
        const role = User.userRoles.Admin
        if(!role || role !== ROLES_LIST.Admin){
            req.params.userId = user_id
        }
        if(req.params.userId !== 'userId'){
            const userSearchedByAdmin = await userModel.findById(req.params.userId)
            if(!userSearchedByAdmin){
                return res.status(StatusCodes.BAD_REQUEST).json({msg:`User with the id : ${req.params.userId} does not exist`})
            }
            return res.status(StatusCodes.OK).json(userSearchedByAdmin)
        }
        res.status(StatusCodes.OK).json(User)
     

}

const makeUserAdmin = async(req,res)=>{
    const userId = req.params.userId

    const user = await userModel.findById(userId)
    if(!user){
        throw new BadRequestError(`No user found with id : ${userId}`)
    }
    const updateDetails = {userRoles:{Admin:ROLES_LIST.Admin}}
    const updatedUser = await userModel.findOneAndUpdate({_id:userId},updateDetails,{new:true,runValidators:true})

    res.status(StatusCodes.OK).json({updatedUser})

}


module.exports = {
    getAllUsers,
    getSingleUser,
    makeUserAdmin
}