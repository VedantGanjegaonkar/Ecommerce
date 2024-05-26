import { Document, Schema, model } from 'mongoose';

export interface IRole extends Document {
    name: string;
   
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true },
    
},
{
    timestamps:true
});

export const Role = model<IRole>('Role', roleSchema);
