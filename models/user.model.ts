import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: Schema.Types.ObjectId;
    
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
    
},
{
    timestamps:true
});

const User = model<IUser>('User', userSchema);

export {User,IUser}
