import app from "express"
const route = app.Router()

/**Import Business logic /  Controller */
import Login from "../controllers/Login"

route.get("/login",(req,res) => new Login(req,res).main)

route.get("/", 
    (req, res) => res.render("home/index.html")
)

export default route