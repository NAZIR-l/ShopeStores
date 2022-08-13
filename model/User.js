const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
	const userSchema = mongoose.Schema({
        username : {
            type:String,
        },
        email :{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    });
    // doing hashing to the password 
    // hashSync : do not out from the function to end the hashing
    userSchema.methods.hashPassword = function(password){
        return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
          
      
    }
    userSchema.methods.comparePassword=function(password){
        return bcrypt.compareSync(password,this.password);
    } //function for compare the password with hashing and withour hashing for the passpot
    
    module.exports=mongoose.model('User',userSchema);