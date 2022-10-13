import jwt from "jsonwebtoken";
import { isEmpty, ResponseJson } from "../utils/helper";
import { Request, Response, NextFunction } from "express"
export const verifyToken = (token:string) => jwt.verify(token, <string>process.env.PRIVATE_KEY);

export const setToken = (payload:object = {}) => {
    let token:string = "";
    try {
        token = jwt.sign(payload, <string>process.env.PRIVATE_KEY);
    } catch (error) {
        throw error
    }
    return token;
}

export const authV2 = (req: Request, res: Response, next: NextFunction, roles: Array<string>) => {
    let authorization: string = "";
    let token: any = "";
    let data: any = {};
    let response_json: ResponseJson;
    
    try {
        if(!isEmpty(req.cookies.__session__)) {
            token = Buffer.from(req.cookies.__session__,"base64").toString()
        }else {
            authorization = req.headers["authorization"] || "";
            if (authorization === "" || authorization === undefined) throw "Unauthorized";
            token = authorization.split(" ");
            token = token[1];
        }
        
    } catch (error) {
        return res.status(401).json(response_json = {
            data: {},
            message: error,
            status: "fail",
            status_code: 401
        })
    }
    try {
        data = verifyToken(token)
    } catch (error) {
        return res.status(401).json(response_json = {
            data: {},
            message: "Unauthorized",
            status: "fail",
            status_code: 401
        })
    }
    req.body.SESSION = data;
    if (roles[0] === "*") return next();
    roles = roles.filter((i) => i === data.userable_type);
    if (roles.length === 0) return res.status(401).json(response_json = {
        data: {},
        message: "Unauthorized",
        status: "fail",
        status_code: 401
    })
    return next()
}

export const authView = (req: Request, res: Response, next: NextFunction, roles: Array<string>) => {
    let authorization: string = "";
    let token: any = "";
    let data: any = {};
    let response_json: ResponseJson;
    try {
        token = req.cookies.__session__
        token = Buffer.from(token, "base64").toString()
    } catch (error) {
        return res.render("notfound.eta")
    }
    try {
        data = verifyToken(token)
        console.log(data)
    } catch (error) {
        return res.render("notfound.eta")

    }
    req.body.SESSION = data;
    if (roles[0] === "*") return next();
    roles = roles.filter((i) => i === data.userable_type);
    if (roles.length === 0) return res.render("notfound.eta")

    return next()
}