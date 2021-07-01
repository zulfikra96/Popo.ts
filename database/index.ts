import fs  from "fs";
import { sql } from "../config/database"

const buildTable = async () => {
    const SCHEME = fs.readFileSync(__dirname + "/create_table.pgsql");
    sql(SCHEME.toString(),[]);
}

const dropTable = async () => {
    const DROP = fs.readFileSync(__dirname + "/drop_table.pgsql")
    sql(DROP.toString(),[]);
}

const alterTable = async () => {
    const ALTER = fs.readFileSync(__dirname + '/alter_table.pgsql')
    sql(ALTER.toString(),[]);
}

const ARGUMENT = process.argv[process.argv.length - 1];


switch (ARGUMENT) {
    case "BUILD":
        buildTable()
            .then(() => console.log("Success create table"))
            .catch((err) => console.error(err))
        break;
    case "DROP":
        dropTable()
            .then(() => console.log("Success drop table"))
            .catch((err) => console.error(err))
        break;
    case "ALTER":
        alterTable()
            .then(() => console.log("Success alter table"))
            .catch((err) => console.error(err));
        break;
    default:
        break;
}