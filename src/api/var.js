/**
 * 公用配置
 */
//api request method
exports.method = {
    Get: "GET",
    Post: "POST",
    Put: "PUT",
    Delete: "DELETE"
};
//api url env type
exports.envType = {
    Dynamic:"dynamic",
    Static: "static"
};

//配置路由前缀
exports.adaptUrl=function(envType, url) {
    return process.env.apiUrlPrefix[envType] + url;
}