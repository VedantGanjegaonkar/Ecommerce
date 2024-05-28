import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { NotFoundError } from '../utils/errors';


interface CustomRequest extends Request {
    user?: any; // Define the user property as optional
}

export function adminOnly(req: CustomRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
   
    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized (TOKEN not found)' });
        return;
    }
    
    const user = jwt.verify(authHeader, 'secret') as { userId: string; role: string; iat: number; exp: number; };
    if (!user) {
        res.status(403).json({ message: 'Forbidden (User not found)' });
        return;
    }

    // console.log("this is Role : ",user.role);
    
    if (user.role !== "6654724561af1ee31ccc7a1a"){
        res.status(403).json({ message: 'u are not a admin,only admin have the access to this endpoints' });
        return;
    }


    req.user = user;
    console.log(user);
    next();
}


export function anyLogedIn(req: CustomRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
   
    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    
    const user = jwt.verify(authHeader, 'secret') as { userId: string; role: string; iat: number; exp: number; };
    if (!user) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    //gg
    req.user = user;
    console.log(user);
    next();
}

export async function getUserID(req: CustomRequest, res: Response, next: NextFunction):Promise<string>{
    const authHeader = req.headers['authorization'];

    
    if (!authHeader) {
        throw new NotFoundError("header not found")
        // res.status(401).json({ message: 'Unauthorized' });
        // return;
    }
    
    const user = jwt.verify(authHeader, 'secret') as { userId: string; role: string; iat: number; exp: number; };
    if (!user) {
        throw new NotFoundError("user not found")
    }
 const userID = user.userId
return userID


}