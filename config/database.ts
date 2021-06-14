import  {  Db, MongoClient } from "mongodb";
const USERNAME  = process.env.dbusername || "si"
const PASSWORD  = process.env.dbpass || "pass123"

const URL       = `mongodb://${USERNAME}:${PASSWORD}@mongodb:27017`;
const PG_URL    = ``;
const database  = process.env.dbname  || "information_system";

interface DbCallback {
    (db:Db, client:MongoClient):void
}

export const sql = () => {
    
}

export const noSql = async (callback:DbCallback) => {
    const mongo_client = new MongoClient(URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });  
    const client = await mongo_client.connect()
    const db =  client.db(database);
    return callback(db,client);
}