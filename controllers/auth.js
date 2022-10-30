const userModel = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError } = require('../errors')
const ROLES_LIST = require('../UserRoles/roles_list')

const register = async(req,res)=>{

    const {name,email, password} = req.body

    

    if(!name || !email || !password){
        throw new BadRequestError('Please fill out all the fields')
    }

    const userDetails = {
        name : name,
        email :email,
        password:password
    }
        const users = await userModel.find({})
        if(users.length == 0){
         userDetails.userRoles = {Admin:ROLES_LIST.Admin}
        }
        const user = await userModel.create(userDetails)

        // save session by adding user information since saveUninitialized is set to false
        req.session.userId = user._id
        req.session.name = user.name
        req.session.userRoles = user.userRoles

        res.status(StatusCodes.CREATED).json(user) 

}

const login = async(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await userModel.findOne({email})

    if(!user){
        throw new BadRequestError(`No user found with email : ${email}`)
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new BadRequestError('Incorrect password!')
    }

    
        // save session by adding user information since saveUninitialized is set to false
        req.session.userId = user._id
        req.session.name = user.name
        req.session.userRoles = user.userRoles

        res.status(StatusCodes.OK).json({
                UserId: user._id,
                name : user.name
            })
    
    
    
   

}

const logout = async(req,res)=>{
    if(req.session.userId){
        req.session.destroy(err => {
            res.clearCookie("connect.sid");
            if (err) {
              res.status(400).send('Unable to log out')
            } else {
              res.send('Logout successful')
            }
          });
        
          
    }
    else{
        res.status(StatusCodes.OK).json({message:'user not logged in'})
    }
    
}

module.exports = {
    register,
    login,
    logout
}