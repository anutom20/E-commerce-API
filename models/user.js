const mongoose = require('mongoose')
const {Schema} = mongoose;
const bcrypt = require('bcryptjs')
const ROLES_LIST = require('../UserRoles/roles_list')


const UserSchema =  new Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        maxLength: 50
    },
    email:{
        type:String,
        required:[true,'Please provide e-mail'],
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        maxLength: 50,
        unique : true
    },
    password:{
      type:String,
      required:[true, 'Please provide password'],
      minLength:6
    },
    userRoles:{
        Admin:{
            type:Number,
            enum : ROLES_LIST.Admin
        },
        
        User:{
            type:Number,
            enum: ROLES_LIST.User,
            default: ROLES_LIST.User
        }

    }
})



UserSchema.pre('save',async function(){
    // hash password

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)

})


UserSchema.methods.comparePassword = async function(EnteredPassword){
    isMatch = await bcrypt.compare(EnteredPassword, this.password)
    return isMatch
}



const userModel = mongoose.model('User', UserSchema)

module.exports = userModel