import  {  Db, MongoClient } from "mongodb";
import { Pool } from "pg"
import redis from "redis";
const REDIS_CLIENT = redis.createClient({
    host:<string>process.env.REDIS_HOST,
    port:parseInt(<string>process.env.REDIS_PORT)
})
const USERNAME  = process.env.dbusername || "si"
const PASSWORD  = process.env.dbpass || "pass123"

const URL       = `mongodb://${USERNAME}:${PASSWORD}@mongodb:27017`;
const postgres = new Pool({
    user:process.env.PG_USERNAME,
    password:process.env.PG_PASSWORD,
    host:process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    port:parseInt(<string>process.env.PG_PORT),

})
postgres.on("error",(err, client) => {
    console.error(err);
})

const database  = process.env.dbname  || "information_system";

interface DbCallback {
    (db:Db, client:MongoClient):void
}

export const sql = (query:string, params:Array<any>) => {
    return new Promise((resolve, reject) => {
        postgres.connect((err, client, done) => {
            if(err) throw err
            client.query(query, params, (err, result) => {
                done()
                if(err){
                    return reject(err.stack)
                }
                return resolve(result.rows)
            })
        })
    })
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

export const sqlWithCache = (query:string, params:Array<any>, cache:boolean = false, cache_flush:boolean = false, cache_duration:number = 10) => {
    if(cache_flush){
        REDIS_CLIENT.flushall();
    }
    if(cache){
        return new Promise((resolve, reject) => {
            REDIS_CLIENT.get(query, async (err, result) => {
                if(err) return reject(err);
                if(result === null){
                    const FETCH = await sql(query, params);
                    if(cache_duration === 0 || cache_duration === null){
                        REDIS_CLIENT.set(query, JSON.stringify(FETCH),(err,result) => {
                            if(err) return reject(err);
                            return resolve(JSON.parse(<string>FETCH));
                        });
                    }else{
                        REDIS_CLIENT.setex(query, cache_duration, JSON.stringify(FETCH),(err) => {
                            if(err) return reject(err);
                            return resolve(JSON.parse(<string>FETCH))
                        })
                    }
                }
                return resolve(JSON.parse(<string>result));
            })
            
        })
    }
    return sql(query, params);
}