import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    // Creates a special connection to the user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',

    },
    // The URL to the link
    title: {
        type: String,
        required:[true, 'Please provide a title for your link'],
        trim: true,
    },
    url: {
        type: String,
        required: [true, 'Please provide a URL for your link'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- .\/?%&=]*)?$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    position: { 
        type: Number,
        required: true,
      },
    },
 {timestamps: true,
}
);

const Link = mongoose.model('Link', linkSchema);
export default Link;