import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    joinDate: Date,
    pictureRoute?: string,
    encryptPassword(password: string): Promise<string>,
    validatePassword(password: string): Promise<boolean>
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    pictureRoute: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);

}

export default model<IUser>('Users', userSchema);