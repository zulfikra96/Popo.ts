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


export const pagination = (page: number): any => {
    let _page: number = (isEmpty(page) === true || page === 1 || page === 0) ? 0 : page * 10 - 10;
    _page = (isNaN(_page)) ? 1 : (_page < 0) ? 0 : _page;
    const page_str = `LIMIT 10 OFFSET ${_page}`;
    return page_str;
};

export const removeAttribute = (data: any, attr: string): any => {
    data = Object.assign(data);
    delete data[attr];
    return data;
};

export const objectToArrayQuestionMark = (data: any): any => {
    if (typeof data !== "object") throw "Invalid object";
    if (Array.isArray(data)) throw "data must be object not array";
    const object_array: any[] = [];
    let i = 1;
    Object.keys(data).forEach(() => {
        object_array.push(`$${i}`);
        i++;
    });
    // output [$1, $2, $3]
    return object_array;
};

export const unformatDateToFormated = (value: any, type = "dd/mm/yyyy"): any => {
    switch (type) {
        case "dd/mm/yyyy":
            value = value.split("/");
            value = value[2] + "-" + value[1] + "-" + value[0];
            return value;

        default:
            break;
    }
};

export const removeUndefinedData = (data: any): any => {
    if (typeof data !== "object") throw "Data must be object";

    let bind: any = {};
    for (const obj in data) {
        if (data[obj] !== undefined) {
            bind = { ...bind, [obj]: data[obj] };
        }
    }
    return bind;
};

export const concatCountry = (country: string): string => {
    if (country.indexOf(" ") !== -1) {
        return country.toLocaleLowerCase().replace(/\s/g, "_");
    }
    return country.toLowerCase();
};

export const getDateTimeByByTimezone = (country: string, format_date = "hh:mm:ss yyyy-MM-dd"): any => {
    let timezoned: any = "";
    switch (country) {
        case "malaysia":
            timezoned = utcToZonedTime(new Date(), "Asia/Kuala_Lumpur");
            return format(timezoned, format_date);

        default:
            timezoned = utcToZonedTime(new Date(), "Asia/Kuala_Lumpur");
            return format(timezoned, format_date);
    }
};

export const salaryCounter = (data = {
    start_date: new Date(),
    end_date: new Date(),
    start_time: "",
    end_time: "",
    total_worker: 0,
    salary: ""
}): any => {
    // console.log("Data helper ====>>>")
    // console.log(data)
    // console.log("Data helper ====>>>")
    if (isEmpty(data.end_date)) throw "End date can not be empty";
    if (isEmpty(data.start_date)) throw "Start date can not be empty";
    if (isEmpty(data.start_time)) throw "Start time can not be empty";
    if (isEmpty(data.end_time)) throw "End time can not be empty";
    // const date = format(new Date().toLocaleDateString(),"yyyy-MM-dd")
    const total_day = differenceInDays(data.end_date, data.start_date) + 1;
    // total_day+=1
    const start_time = new Date(new Date().toLocaleDateString() + " " + `${data.start_time}`);
    const end_time = new Date(new Date().toLocaleDateString() + " " + `${data.end_time}`);
    const total_time = differenceInHours(end_time, start_time);
    let count = total_time * parseFloat(data.salary);
    count = count * total_day;
    count = count * parseInt(data.total_worker.toString());
    return count;
};

export function throwError(message: string, error_code?: string): object {
    return {
        status: "error",
        status_code: 422,
        message: message + ", " + error_code,
        error_code: error_code
    };
}

export function throwFail(message: string, status_code: number): object {
    return {
        status: "fail",
        status_code: status_code,
        message: message
    };
}