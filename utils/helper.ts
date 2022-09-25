import Cryptr from "cryptr";
import { sql } from "../config/database"
import { Request, Response } from "express"
const private_key: string = <string>process.env.PRIVATE_KEY ;
export const crypter = new Cryptr(private_key);
export interface ResponseJson  {
    status_code:404 | 400 | 422 | 200 | 401,
    status:"fail" | "error" | "success" ,
    message:string,
    data:any,
    total_data?:number,
    page_active?:number
};

export const encrypt = (plain_text: string) => crypter.encrypt(plain_text);

export const decrypt = (chipper_text: string) => crypter.decrypt(chipper_text);

export const addLog = (activity:string, user_id:any = null, type:any = null) => {
    const QUERY = `INSERT INTO logs (activity, user_id, type) VALUES($1, $2, $3)`;
    const PARAMS = [activity, user_id, type];
    return sql(QUERY, PARAMS);
}

export const isEmpty = (value:any) => {
    if (value === null || value === undefined || value === '') {
        return true
    }
    return false
}

export const emailValidator = (email:string) => {
    const EMAIL_REG =  /^([a-zA-Z0-9@#$%^&*\.\,\(\)\-\_]+)@([a-z]\w*)([\.]\w+)+/
    if(email.match(EMAIL_REG) === null) return false
    return true
}

export const passwordMinValidator = (password: string) => {
    if(password.length < 6) return false 
    return true
}

export const passwordValidator = (password: string) => {
    const PASS_REG = /[a-zA-Z]\w*(?:([\.~!@#$%^&*\(\_\/?)][0-9]\w*)|(?:[0-9][\.~!@#$%^&*\(\)_\/?]\w*))/
    if(password.match(PASS_REG) === null) return false 
    return true
}

export const mobilePhoneValidator = (mobile: string) => {
    const MOBILE_REG = /([\d]+){10}($|[^a-z\d])/
    if(mobile.match(MOBILE_REG) === null) return false
    return true
}

export const userableTypeValidator = (userable_type: string) => {
    const USERABLE_TYPE_REG = /^worker$|^employer$/
    return USERABLE_TYPE_REG.test(userable_type);
}

export const randomNumber = (min:number, max:number) => Math.floor(Math.random() * max) + min;

export const maxLengthString = (value: string, max:number) => {
    if(value.length > max) return true
    return false
}

enum StatusCode {
    "success"   = 200,
    "error"     = 422,
    "unauthorized" = 401,
    "not_found" = 404  
}

export const response = (res: Response,status_code:404 | 400 | 422 | 200 | 401, status: 'success' | 'fail' | 'error',message: string ,data: object = {}, total_data: number = 0, page_active:number = 0) => {
    let response: ResponseJson = {
        status_code,
        status,
        message,
        data,
    }
    if(total_data !== 0){
        response["total_data"] = total_data
    }
    if(page_active !== 0){
        response["page_active"] = page_active
    }
    
    return res
        .status(status_code)
        .json(response)
}
