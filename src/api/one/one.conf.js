import {
    method,
    envType,
    adaptUrl
} from "../var.js";

export default{
    "one.demo": {
        method: method.Get,
        url: {
            dynamic: adaptUrl("dynamic","/one.demo"),
            static: adaptUrl("static","")
        },
        staticActive:""
    }
}