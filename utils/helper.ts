import Cryptr from "cryptr";
import { sql } from "../config/database"
const private_key: string = <string>process.env.PRIVATE_KEY ;
export const crypter = new Cryptr(private_key);
export type ResponseJson = {
    status_code:404 | 400 | 422 | 200 | 401,
    status:"fail" | "error" | "success" ,
    message:string,
    data:any
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
    const EMAIL_REG = /^([a-zA-Z0-9@#$%^&*\.\,\(\)\-]+)@([a-z]\w*)([\.]\w+)+/;
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