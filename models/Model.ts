import { ObjectID, ObjectId } from "bson"
import { noSql, sql, sqlWithCache, REDIS_CLIENT } from "../config/database"
import { UpdateOperation } from "./Users"

export default class Model {
    protected collection: string = "";
    protected table_name: string = "";

    constructor() { }
    /**
     * @description this function to get data from mongodb
     * @param args 
     * @returns 
     */
    protected async findOne(args: Object, fields: object, cache?:boolean, cache_duration: number = 5) {
        return new Promise((resolve, reject) => {
            noSql((db, client) => {
                const collection = db.collection(this.collection)
                collection.findOne(args, {projection:fields}, (err, result) => {
                    if(err){
                        console.error(err)
                        return reject(err)
                    }
                    if(cache){
                        return REDIS_CLIENT.get(JSON.stringify(args),(err,_result) => {
                            if(err){
                                 console.error(err);
                                return reject(err)
                            }
                            client.close()
                            if(_result === null){
                                REDIS_CLIENT.setex(JSON.stringify(args), cache_duration,JSON.stringify(result));
                                return resolve(result);
                            }
                            return resolve(JSON.parse(_result));
                        })
                    }
                    
                    client.close()
                    return resolve(result);
                })
            })
        })
    }

    protected async findAll(args: Object = {}) {
        return new Promise((resolve, reject) => {
            noSql((db, client) => {
                const collection = db.collection(this.collection)
                collection.find(args).toArray((err, result) => {
                    if (err) return reject(err)
                    client.close()
                    return resolve(result)
                })
            })
        })
    }

    protected updateOne(query:object, operation:UpdateOperation) {
        return new Promise((resolve, reject) => {
            noSql(async (db, client) => {
                const collection = await db.collection(this.collection);
                const response   = await collection.updateOne(query, operation)
                    .catch(reject)
                client.close()
                return resolve(response)
            })
        })
    }

    protected deleteOne(filter: any) {

        return new Promise((resolve, reject) => {
            noSql(async (db, client) => {
                const filter_attr = Object.keys(filter)
                if (filter_attr.length === 1 && filter_attr[0] === "_id") {
                    filter[filter_attr[0]] = new ObjectID(filter[filter_attr[0]])
                }
                try {
                    const collection    = await db.collection(this.collection);
                    const response      = await collection.deleteOne(filter)
                    client.close()
                    return resolve(response);
                } catch (error) {
                    console.error(error)
                    return reject(error)
                }
            })
        })
    }

    protected insertOne(value: object) {
        return new Promise((resolve, reject) => {
            noSql(async (db, client) => {
                const collection = await db.collection(this.collection);
                const response = await collection.insertOne(value)
                client.close()
                resolve(response)
            })
        })
    }
    
    protected addMany() {

    }

    /**
     * 
     * @param attr example => ['id','name','email']
     * @param where example => WHERE email = $1
     * @param params example => ['johndoe@mail.com']
     */
    protected async selectOne(columns:Array<string>, where: string, params:Array<any>, cache?:boolean){
        const query = `SELECT ${columns} FROM ${this.table_name} ${where} LIMIT 1`
        let fetch:any;
        if(cache){
            fetch = await  sqlWithCache(query, params,true);
        }else{
            fetch = await sql(query, params);
        }
        if(fetch.length === 0) return {}
        return fetch[0];
    }
    /**
     * @description SQL Update
     * @param set example => 'SET column1 = $1, column2 = $2'
     * @param where example => 'WHERE column3 = $3'
     * @param params example => ['param1', 'param2', 'param3']
     */
    protected async update(set:string, where:string, params:Array<any>){
        if(this.table_name === "" || this.table_name === undefined) throw "Table name requires"
        const QUERY = `UPDATE ${this.table_name} ${set} ${where} `
        return sql(QUERY, params);
    }

    protected async insert(columns:Array<any> = [], params:Array<any> = [], returning?:Array<any>){
        let values: Array<any> = [];
        let sequence: number   = 1;
        if(columns.length === 0){
            return sql(`INSERT INTO ${this.table_name} (created_at, updated_at) VALUES(NOW(), NOW()) ${(returning !== undefined) ? `RETURNING ${returning} ` : ''}`, params);
        }
        columns.forEach((e) => {
            values.push(`$${sequence}`)
            sequence++;            
        })
        const QUERY = `INSERT INTO ${this.table_name} (${columns}) VALUES(${values}) ${(returning !== undefined) ? `RETURNING ${returning}` : ''}`;
        return sql(QUERY, params);
    }

    protected selectAll(
        columns: Array<string>, 
        where: string = "", 
        params: Array<any> = [], 
        limit: number  = 10, 
        offset: number = 0, 
        cache: boolean = false, 
        cache_time:number = 10){
        let query: string;
        if(limit !== 0)
            query = `SELECT ${columns} FROM ${this.table_name} ${where}  LIMIT ${limit} OFFSET ${offset}`;
        else 
            query = `SELECT ${columns} FROM ${this.table_name} ${where}`    
        if(cache){
            return sqlWithCache(query, params, true, false, cache_time);
        }
        return sql(query, params);
    }

}