import { sqlWithCache } from "./database"
import web_push from "web-push";

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

