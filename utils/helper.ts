
export type ResponseJson = {
    status_code:404 | 400 | 422 | 200,
    status:"fail" | "error" | "success",
    message:string,
    data:any
};

