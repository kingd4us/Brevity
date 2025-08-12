import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcryptjs';

//blueprint for our user document
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username'], // The field must be filled 
            unique: true, // No two users can have the same username
            trim: true, // removes whitespace from the beginning and end
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            trim: true,
            lowercase: true, //maknig sure email is stored in lowercase
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ], // This regex checks if the email format is valid
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be as least 6 characters long'], //enforce minimum length
        },
        bio: { // 👇 ADD THIS
            type: String,
            maxlength: [160, 'Bio cannot be more than 160 characters'],
            default: '',
        },
    },
    {
        //this option adds two fields to our schema: `createdAt` and `updatedAt`
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

//special Mongoose "middleware" that runs *before* a document is saved
userSchema.pre('save', async function (next) {
    // we only want to hash the password if it;s new or has been modified
    if (!this.isModified('password')){
        return next();
    }

      // Generate a "salt" - a random string to make the hash more secure
      const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();//continue to the next step (saving the document) 
}); 

const User = mongoose.model('User', userSchema);

export default User;