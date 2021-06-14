import Controller from "./Controller"
import { Request, Response } from "express"
import { ResponseJson } from "../utils/helper";
import Users from "../models/Users";
import { ObjectID } from "bson";


export default class UpdateUser extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public get main() {
        let response_json:ResponseJson;
        let query_id    = this.query._id
        const body      = this.body
        return (async () => {
            await this.updateUser({_id:new ObjectID(query_id)}, body)
            try {
                response_json = {
                    data:{},
                    message:"",
                    status:"success",
                    status_code:200
                }
                return this.res.json(response_json)
            } catch (error) {
                console.error(error)
                response_json = {
                    data:{},
                    message:"something is wrong, 001",
                    status:"error",
                    status_code:422
                }
                return this.res.json(response_json)
            }
        })()
    }

    public updateUser(query: object, value: object){
        const user = new Users()
        return user.updateUser(query,{$set:value})
    }
}