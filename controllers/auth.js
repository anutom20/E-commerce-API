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
        const token = await user.generateAccessToken()
        res.status(StatusCodes.CREATED).json({
                id: user._id,
                name: user.name,
                token: token
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

    
        const token = await user.generateAccessToken()
        res.status(StatusCodes.OK).json({
                UserId: user._id,
                name : user.name,
                token : token
            })
    
    
    
   

}

const logout = async(req,res)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error('Logout failed , Authentication required!')
    }

    req.headers.authorization = ''
    res.status(StatusCodes.OK).json({
        message: "logout successful!",
        token : ''
    })
    
}

module.exports = {
    register,
    login,
    logout
}