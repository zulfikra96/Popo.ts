import eta from "eta"
export default class Views {
    main(app: any) {
        
        app.set("view engine", "eta")

        app.set("views","./views")
    }
}