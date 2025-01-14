import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;