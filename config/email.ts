import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/smtp-connection"

type SendEmailArgument = {
    to:string,
    from:string,
    subject:string,
    text:string,
    attachment?:Array<any>
}

const CONFIG:Options = {
    host:process.env.EMAIL_HOST,
    port:parseInt(<string>process.env.EMAIL_PORT),
    secure:(/true/i).test(<string>process.env.EMAIL_SECURE),
    auth:{
        user:process.env.EMAIL_AUTH_USER,
        pass:process.env.EMAIL_AUTH_PASS
    },
}

export const mail = () => {
    const   TRANSPORT = nodemailer.createTransport(CONFIG);
    return  TRANSPORT
}

export const sendEmail = async (args:SendEmailArgument, attachment:Array<any> = []) => {
    if(attachment.length > 0){
        args.attachment = attachment;
    }
    const INFO = await mail().sendMail(args);
    console.log("message sent: ", INFO.messageId);
    console.log("Preview URL %s", nodemailer.getTestMessageUrl(INFO));
    return Promise.resolve()
}