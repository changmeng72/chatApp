const mongoose = require('mongoose');
const encrypt = require('../utils/encrypt');
const { findByIdAndUpdate } = require('./missingMessages');



const UserSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, lowercase: true, required: true ,unique:true},
    passw: { type: String, required: true },
    avatar: { type: String, default: null },
    status: { type:String, default: 'available'},
    createdTime:{type:Date, default: Date.now()}
});

 
UserSchema.statics.publicField=function (){
    return ['id','username', 'email', 'avatar','status'];
}



UserSchema.statics.signUp = async function (username,email,passw) {
    try {
        const users = await this.find({ email });
        
            if (users?.length > 0)
                return { result: "nok", resCode:409 ,description: "Email has already existed in the system" };
             console.log('users: ',users);
            passw = encrypt(passw);
        const user = await this.create({ username, email, passw });
        
        user.passw = '';
        console.log('create ok:' ,user);
            return { result: 'ok',resCode:200, description: "User has been created",user };
               
    } catch (err) {
        console.error(err);
        return { result: "nok",resCode:500, description: "System error r" };
    }   
}

UserSchema.statics.signIn = async function (email,passw) {
    try {
        console.log(email,encrypt(passw))
         const user = await this.findOne({ email:email,passw:encrypt(passw) })?.select(this.publicField());
            if (user)
                return { result: "ok",resCode:200, user};
            return { result: 'nok', resCode:404,description:"email and passord are not valid"};
               
    } catch (err) {
        console.error(err);
        return { result: "nok", reCode:500,description:"System busy,please try latter" };
    }   
}
UserSchema.statics.updateStatus = async function (userid, newStatus) {
    try {
        user = await this.findByIdAndUpdate(userid, { status: newStatus })?.select(this.publicField());
        if (user) return { result: 'ok', user };
        else {
            return {result:'nok',description: "not valid userid"};
        }
    } catch (err) {
        return {result: 'nok',description: "system failure"}
    }
}

UserSchema.statics.getUsers = async function () {
    try {
        console.log('get users');
        const users = await this.find()?.select(this.publicField());
        return { result: 'ok', users };
    } catch (err) {
        return {result:'nok',description:"system failure"}
    }
}

UserSchema.statics.getUserByName = async function (username) {
    try {
        console.log('get users');
        const user = await this.findOne({ username })?.select(this.publicField());
        if (user)
            return { result: 'ok', user };
        else
            return { result: 'nok', description: 'not found the user' };
    } catch (err) {
        return {result:'nok',description:"system failure"}
    }
}
UserSchema.statics.getUser = async function (userId) {
    try {
        console.log('get user');
        const user = await this.findById(userId)?.select(this.publicField());
        return { result: 'ok', user };
    } catch (err) {
        console.error(err);
        return {result:'nok',description:"system failure"}
    }
}

UserSchema.statics.changeStatus = async function (userId,newStatus) {
    try {        
         await this.findByIdAndUpdate(userId,{status:newStatus}) ;         
    } catch (err) {
        console.error(err);
        
    }
}

module.exports = mongoose.model('User',UserSchema);