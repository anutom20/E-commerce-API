const userModel = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const { BadRequestError } = require('../errors')

const register = async(req,res)=>{

    const {name,email, password} = req.body

    if(!name || !email || !password){
        throw new BadRequestError('Please fill out all the fields')
    }
    
        const user = await userModel.create(req.body)

        // save session by adding user information since saveUninitialized is set to false
        req.session.userId = user._id
        req.session.name = user.name
        req.session.userRoles = user.userRoles

        res.status(StatusCodes.CREATED).json({
                id: user._id,
                name: user.name
            }) 

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
            if (err) {
              res.status(400).send('Unable to log out')
            } else {
              res.send('Logout successful')
            }
          });
    }
    else{
        res.status(StatusCodes.OK).send('User not logged in')
    }
    
}

module.exports = {
    register,
    login,
    logout
}