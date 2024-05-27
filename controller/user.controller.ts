import { Request, Response,NextFunction } from 'express';
import { UserService } from '../services/user.service';
import{errorHandler} from "../middleware/errorHandler"

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
      
        this.login = this.login.bind(this);
        this.createUser = this.createUser.bind(this);
        this.createCart = this.createCart.bind(this);

    }

    public async login(req: Request, res: Response, next:NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await this.userService.findUserByEmail(email);
          
            await this.userService.validatePassword(password, user.password);
            
            const token = this.userService.generateAuthToken(user._id.toString(), user.role);

            res.status(200).json({ message: 'Login successful', token });
        } catch (err: any) {
            errorHandler(err,req,res,next)
        }
    }

    public async createUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { username, email, password, role } = req.body;

            // Create the user object
            const createUserParams = { username, email, password, role };

            // Call the service to create a user
            const newUser = await this.userService.createUser(createUserParams);
            const newCart = await this.userService.createCart(newUser._id)

            res.status(201).json({ message: 'User and its cart created successfully', user: newUser,cart: newCart });
        } catch (err: any) {
            errorHandler(err,req,res,next)
        }
    }

    public async createCart(req: Request, res: Response,next:NextFunction){
try {
    const { user }= req.body 

    const newCart = await this.userService.createCart(user)
    res.status(201).json({ message: 'cart created successfully',cart: newCart });
    
} catch (err:any) {
    errorHandler(err,req,res,next)
}
       

    }
}