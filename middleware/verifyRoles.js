const {UnauthenticatedError} = require('../errors')

const verifyRoles = (...requiredRoles)=>{
  return async(req,res,next)=>{
     const rolesArray =[...requiredRoles] 
     const userRoles = Object.values(req.user.roles)
       
     rolesArray.forEach((role)=>{
         if(!userRoles.includes(role)){
            throw new UnauthenticatedError('Not authorized to access this route')
         } 
     })
     
     next()
  }
}

module.exports = verifyRoles