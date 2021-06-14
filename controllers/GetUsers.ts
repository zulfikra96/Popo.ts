import Controller from "./Controller"
import { Request, Response } from "express"
import { ResponseJson } from "../utils/helper";
import Users from "../models/Users";


export default class GetUsers extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public get main() {
        return (async () => {
            try {
                const users = await this.get();
                const response_json: ResponseJson = {
                    data: users,
                    status_code: 200,
                    message:"",
                    status:"success"
                }
                return this.res.json(response_json)
            } catch (error) {
                console.error(error)
                const response_json: ResponseJson = {
                    data:{},
                    status_code:422,
                    message:"Something is not right",
                    status:"error"
                }
                return this.res.json(response_json)
            }
        })()
    }

    public add() {

    }

    public update() {

    }

    public delete() {

    }

    public async get() {
        try {
            const get_users = new Users();
            return get_users.getUsers({});
        } catch (error) {
            throw error
        }
        
    }
}