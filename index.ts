import express from "express";
import * as dotenv from "dotenv"
import route from "./routes"
import Bootstrap from "./config/bootstrap";
import Loaders from "./config/loaders"
import Views from './config/views';

dotenv.config();
const app = express();
const bootstrap = new Bootstrap(app);

bootstrap.loadUseModule(Loaders());
bootstrap.loadRouteModule(route());

const views = new Views()
views.main(app)

const PORT: any = process.env.PORT || 4000; 

bootstrap.listen(PORT);