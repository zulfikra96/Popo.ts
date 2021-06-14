import { ObjectID, ObjectId } from "bson"
import { noSql } from "../config/database"
import { UpdateOperation } from "./Users"

export default class Model {
    protected collection: string = ""

    constructor() { }

    protected async findOne(args: Object) {
        return new Promise((resolve, reject) => {
            noSql((db, client) => {
                const collection = db.collection(this.collection)
                collection.findOne(args, (err, result) => {
                    if (err) return reject(err)
                    client.close()
                    resolve(result);
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

}