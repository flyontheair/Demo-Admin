import {
    method,
    envType,
    adaptUrl
} from "../var.js";

export default{
    "two.demo": {
        method: method.Get,
        url: {
            dynamic: adaptUrl("dynamic","/two.demo"),
            static: adaptUrl("static","")
        }
    }
}