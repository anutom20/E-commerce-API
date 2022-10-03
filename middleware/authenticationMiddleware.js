const UnautheticatedError = require('../errors/Unautheticated')
const authenticationMiddleware = async(req,res,next)=>{
   // check if the session is present

   if(req.session.userId){
      req.user = {userId:req.session.userId, name:req.session.name}
      req.user.roles = req.session.userRoles
      next()
   }
   else{
      throw new UnautheticatedError('Not authorized to access this route')
   }



}

module.exports = authenticationMiddleware 