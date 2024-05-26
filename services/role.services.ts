import {Role} from "../models/index"
import { ValidationError } from "../utils/errors";

export class Roleservice{

    public async createRole(name:string){

        const existingRole=await Role.findOne({name})
        if(existingRole){
            throw new ValidationError("Role alredy exist")
        }

       const role = new Role({ name })
       await role.save();
       return role
 
    }


}