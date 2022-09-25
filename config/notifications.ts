import { sqlWithCache } from "./database"
import web_push from "web-push";
import { INotificationV3 } from '../interfaces/Notification.interface';

web_push.setVapidDetails(
    "mailto:admin@qwork.my",
    <string>process.env.VAPID_PUBLIC_KEY,
    <string>process.env.VAPID_PRIVATE_KEY
)

interface SendNotifications {
    user_id:number,
    title:string,
    body:string,
    content?:object,
    notification_type:string, 
    role?:string
}

export const sendNotifications = async (args:SendNotifications) => {
    const QUERY:  string  = `SELECT token FROM fcm_tokens WHERE user_id = $1`;
    const PARAMS: Array<any> = [args.user_id];
    const FETCH = await sqlWithCache(QUERY, PARAMS, true, false, 10);
    console.log(FETCH);
}

const httpsSentNotification = async  (args: INotificationV3, tokens: any[]): Promise<any> => {
    const http: any = await fetch(<string>process.env.NOTIFICATION_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Authorization ${process.env.NOTIFICATION_TOKEN}`
        },
        body:JSON.stringify({
            app_id:process.env.APP_ID,
            contents:{en:args.body},
            headings:{en:args.title},
            data:args.data,
            include_player_ids: tokens
        })
    })
    .then((res) => res.json())
    .catch((err) => console.error(new Error(err)));
};

export const sendNotificationv3 = async (args: INotificationV3): Promise<any> => {
    const token_binding: any = [];
    for (let i: number = 0; i < args.users.length; i++) {
        const fetch: any = await sqlWithCache(`
            SELECT token FROM fcm_tokens WHERE user_id = ${args.users[i].user_id}
        `, [], true, false, 1200);
        
        if(fetch.length !== 0 && fetch[0].token !== ""){
            token_binding.push(fetch[0].token);
        }
    }
    if(token_binding.length !== 0){
        for (let i: number = 0; i < token_binding.length; i++) {
            await httpsSentNotification(args, [token_binding[i]]);
        }
    }

};

export const adminSubscription = () => {
    const QUERY = `SELECT id, user_id, subscription FROM subscriptions`;
    return sqlWithCache(QUERY, [], true, false, 10);
}

export const sendWebNotifications = async (subscriptions:any = [], message:SendNotifications ) => {    
    for (let i = 0; i < subscriptions.length; i++) {
        web_push.sendNotification(JSON.parse(subscriptions[i].subscription), JSON.stringify(message));
    }
    return
}

