import Controller from "./Controller"
import { Request, Response } from "express"
import { ResponseJson } from "../utils/helper";
import Users from "../models/Users";


export default class DeleteUser extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public get main() {
        const query = this.query
        
        return (async () => {
            try {
                await this.deleteUser(query);
                const response_json: ResponseJson = {
                    message:"success delete user",
                    data:{},
                    status:"success",
                    status_code:200
                }
                return this.res.json(response_json)
            } catch (error) {
                console.error(error)
                const response_json: ResponseJson = {
                    message:"something is not right",
                    data:{},
                    status:"error",
                    status_code:422
                }
                return this.res.json(response_json)
            }
            
        })()
        
    }

    public async deleteUser(args:any) {
        const users = new Users();
        return users.deleteUser(args);
    }

}