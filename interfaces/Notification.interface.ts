export interface UsersNotification {
    user_id: any
}

export interface INotificationV3 {
    users: UsersNotification[],
    title: string,
    body: string,
    data: object
}