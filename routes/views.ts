import app from "express"
const route = app.Router()

/**Import Business logic /  Controller */


route.get("/", 
    (req, res) => res.render("home/index.eta")
)

export default route