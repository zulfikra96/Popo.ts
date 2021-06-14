import express from "express";
import * as dotenv from "dotenv"
import route from "./routes/api"
import user_resource from "./routes/resources/users"

dotenv.config();
const app = express();

app.use(express.json({limit:800}))
app.use(express.urlencoded({extended:true}))

app.use("/", route);
app.use("/users",user_resource);

const PORT: any = process.env.port || 4000;

app.listen(PORT, () => console.log("app run on ", PORT));