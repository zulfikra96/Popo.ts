import Controller from "./Controller"
import { Request, Response } from "express"
import { noSql } from "../config/database"
import { ResponseJson } from "../utils/helper";
import Users from "../models/Users";

export interface User {
    name:string,
    address:string
}

export default class AddUser extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public get main() {
        return (async () => {
            try {
                await this.addUser(this.req.body)
                const response_json: ResponseJson = {
                    message:"success add users",
                    data:{},
                    status:"success",
                    status_code:200
                }
                return this.res.json(response_json)
            } catch (error) {
                console.error(error);
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

    public async addUser(body: Object = {}){
        const users = new Users();
        return users.addUser(body);
    }
}