import express from "express";
import cookie_parser from "cookie-parser"

////////////////////////////////////////////////////////
////////////////Load Module ////////////////////////////
////////////////////////////////////////////////////////
///
const loaders = [
	express.json({limit:800}),
	express.urlencoded({extended:true}),
	express.static("public"),
	cookie_parser()
]

export default (): Array<any> => {
	return loaders;
}