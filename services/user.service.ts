import {User} from "../models/index"
import { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';


interface CreateUserParams {
    username: string;
    email: string;
    password: string;
    role: Schema.Types.ObjectId;
}

export class UserService {
   
    public async findUserByEmail(email: string) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError('Email not found');
        }
        return user;
    }
    
    public async validatePassword(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid password');
        }
        return isPasswordValid;
    }
    
    public  generateAuthToken(userId: string, role: Schema.Types.ObjectId): string {
        return jwt.sign({ userId, role }, 'secret', { expiresIn: '10h' });
    }

    public async createUser(params: CreateUserParams) {
        const { username, email, password, role } = params;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password:hashedPassword, role });
        await newUser.save();
        return newUser;
    }
}