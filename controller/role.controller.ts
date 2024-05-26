import {Roleservice} from "../services/role.services"
import { Request, Response,NextFunction } from 'express';
import{errorHandler} from "../middleware/errorHandler"



export class RoleController{

    private roleService:Roleservice

    constructor(){
        this.roleService=new Roleservice()

        this.createRole=this.createRole.bind(this)
    }

    public async createRole(req:Request,res:Response,next:NextFunction){

        try {
            const { name } = req.body
            console.log(name);

           const newRole = await this.roleService.createRole(name)
           res.status(200).json({ message: 'Role created successfully', Role: newRole });
            
        } catch (error:any) {

            errorHandler(error,req,res,next)
            
        }

        


    }
}