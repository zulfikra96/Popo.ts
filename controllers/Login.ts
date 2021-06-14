import Controller from "./Controller"
import { Request, Response } from "express"
import { noSql } from "../config/database"

export default class Login extends Controller{

    constructor(req: Request, res:Response){
        super(req, res);
    }

   get main(){
        
        return {}
   }
}