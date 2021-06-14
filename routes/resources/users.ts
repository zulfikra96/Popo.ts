import app from "express"
import AddUser from "../../controllers/AddUser"
import GetUsers from "../../controllers/GetUsers";
import DeleteUser from "../../controllers/DeleteUser"
import UpdateUser from "../../controllers/UpdateUser"
const route = app.Router()

route.route("/")
    .post((req,res)     =>   new AddUser(req,res).main)
    .get((req,res)      =>   new GetUsers(req,res).main)
    .delete((req, res)  =>   new DeleteUser(req,res).main)
    .put((req,res)      =>   new UpdateUser(req,res).main)

export default route