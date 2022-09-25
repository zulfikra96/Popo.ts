import Api from "./api"
import Views from "./views"
import { LoadRoute } from "../interfaces/LoadRoute.interface"

export default (): Array<LoadRoute> => {
	return [
		{prefix:"/v3/gigs/", module:Api},
		{prefix:"/", module: Views}
	];
}