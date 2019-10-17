const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'] //=> we have used validator library which has isEmail method to check if the email is in the right format
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false //=>so it doesn't get send to the client'
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        //add our own custom validator to make sure that password and passwordConfirm match
        validate:{
            //THIS ONLY WORKS ON CREATE or SAVE!!! => whenever we want to update a user we should use save so that this validator can work
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date
});

//ENCRYPT OUR PASSWORDS: 

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next(); 

    this.password = await bcrypt.hash(this.password, 12); //=> hash password with cost of 12

    this.passwordConfirm = undefined; //=>because we don't want it to persist in our database after making sure that it matchs with our password we delete it

    next();
});

//we use bcrypt again to compare our orignal password with the hashed one:
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return  await bcrypt.compare(candidatePassword, userPassword);
};

//check if the user has changed its password
userSchema.methods.changePasswordAfter = function(JWTTimesstamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimesstamp < changedTimeStamp;
    }
    //false means not changed
    return false;
}
const User = mongoose.model('User', userSchema);

module.exports = User;