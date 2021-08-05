import { Express } from "express";
import { LoadRoute } from "../interfaces/LoadRoute.interface"
export default class Bootstrap {
	public app: Express;
	
	constructor(app: Express){
		this.app = app;
	}
	public loadUseModule(modules: Array<any> = []): void{
		modules.forEach(e => {
			this.app.use(e)
		})
	}

	public loadRouteModule(modules: Array<LoadRoute>): void{
		modules.forEach(e => {
			this.app.use(e.prefix, e.module)
		})
	}

	public listen(port: number): void{
		this.app.listen(port, () => {
			console.log("APP run on", port);
		})
	}
}