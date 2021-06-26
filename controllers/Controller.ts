
import { Request, Response } from "express"

export default class Controller {
    protected body:any
    protected query:any
    constructor(public req:Request, public res:Response){
        this.req = req;
        this.res = res;
        this.body = this.req?.body
        this.query = this.req?.query
    }

    public post() {}

    public delete() {}

    public update() {}

    public get() {}
}