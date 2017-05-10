/**
 * axios封装
 */
import axios from "axios";
import {merge} from "lodash";
import { method, envType } from "./var.js";
import apiConfig from "./config.js";

//default ajax(jquery) options
var defaultAjaxOptions = {};
defaultAjaxOptions[method.Get] = {};
defaultAjaxOptions[method.Post] = {
    headers: {
        "content-type": "application/json"

    }
};
defaultAjaxOptions[method.Delete] = {
    headers: {
        "content-type": "application/json"
    }
};
defaultAjaxOptions[method.Put] = {
    headers: {
        "content-type": "application/json"
    }
};

function isFormatUrl(url) {

    return url.indexOf("{") != -1 && url.indexOf("}") != -1;
}

function formatUrl(url, dataModel, options) {
    if (!options.hasOwnProperty("removeFormatModelProp")) {
        //默认移除datamodel中的已经在url中使用的format属性
        options.removeFormatModelProp = true;
    }
    if (isFormatUrl(url)) {
        if (dataModel) {
            Object.keys(dataModel).forEach(function (key) {
                var varName = "{" + key + "}";
                if (url.indexOf(varName) != -1) {
                    url = url.replace(new RegExp(varName, "gm"), dataModel[key]);
                    //格式化url后是否将datamodel中的对应属性移除
                    if (options.removeFormatModelProp) {
                        delete dataModel[key];
                    }
                }
            });
        } else {
            url.split("{").forEach(function (item) {
                if (item.indexOf("}") === item.length - 1) {
                    url = url.replace("{" + item, "");
                }
            });

        }
        return url;
    } else {
        return url;
    }
}

/**
 * 继承默认配置
 * @param {any} ops 配置对象
 * @returns 返回继承后的配置
 */
function extendDefaultOptions(ops) {


    if (typeof ops != "object") {
        ops = {};
    }
    return merge({}, defaultAjaxOptions[(ops.method || method.Get)], ops);
}

/**
 *根据环境配置返回配置项中不同的url值
 * @param ops 接口配置
 * @param apiEnvType 接口类型
 * @returns {*}
 */
function adaptUrl(ops, apiEnvType) {
    if (typeof ops.url === "string") {
        return ops.url;
    }
    return ops.url[apiEnvType];
}

/**
 * 根据环境类型将配置对象做不同适应
 * Production：必须获取production对应的url，method也不会变；
 * Development：先获取Development的url，没有在获取Static的url
 * Static：获取Static对应的url，并改变method为GET
 * @param {any} options 配置对象
 * @returns 适应后的配置对象
 */
function adaptEnv(options, dataModel) {
    //请求链接处理
    if (options.staticActive && typeof options.url != "undefined" && options.url.static != "") {
        options.method = method.Get;
        options.url = adaptUrl(options, envType.Static);
    } else {
        options.url = adaptUrl(options, envType.Dynamic);
    }


    //请求参数处理
    if (typeof dataModel === "object" && dataModel != null) {

        options.url = formatUrl(options.url, dataModel, options);
        if (options.method !== method.Get && options.headers && options.headers['content-type'] === "application/json") {
            if (Array.isArray(dataModel)) {
                options.data = dataModel;
            } else {
                options.data = options.data || {};
                merge(options.data, dataModel);
            }
            options.data = JSON.stringify(options.data);
        } else if (options.method === method.Get) {
            options.params = options.params || {};
            options.params = merge({}, options.params, dataModel);
        }
    } else if (options.method === method.Get) {
        options.params = options.params || {};
        options.params = merge({}, options.params, dataModel);
    } else {
        options.data = dataModel;
    }

    return options;
}

/**
 * 根据apiName获取api的配置
 *
 * @param {any} apiName
 * @param {any} otherOptions 其他的配置信息
 * @returns apiName的配置与otherOptions的合并
 */
function getApiOptions(apiName, otherOptions, dataModel) {
    var options = {};
    if (typeof apiName === "string") {

        if (!apiConfig.hasOwnProperty(apiName)) {
            console.warn("[Api Warning]没有在API列表中查找到名称为'" + apiName + "'的接口配置，已将'" + apiName + "'作为默认url。");
            options = extendDefaultOptions({
                apiName: apiName,
                url: apiName
            });

        } else {
            options = extendDefaultOptions(apiConfig[apiName]);
            options.apiName = apiName;

        }
    } else if (typeof apiName === "object" && apiName.url) {
        options = extendDefaultOptions(apiName);
    } else {
        throw new TypeError("[Api Error]没有在API列表中查找到" + JSON.stringify(apiName) + "有关的配置");
    }
    if (typeof otherOptions === "object") {
        options = merge(options, otherOptions);
    }
    //options.data = options.data || {};

    options = adaptEnv(options, dataModel);
    return options;
}

function defaultCheckResolve(data, xhr) {
    if (!data || data.code != 200) {
        return false;
    }
}

function defaultTransformResolve(data, xhr) {
    if (data && data.code == 200) {
        return data;
    }
};

function defaultTransformReject(data, xhr) {
    if (data && data.code != 200) {
        return {
            code: data.code,
            message: data.code == 401 ? "你还未登录，或者登录已超时，请重新登录！" : data.message,
            _source: data
        };
    } else if (!data && xhr) {
        if (xhr.status === 0 && xhr.statusText !== "NO-LOGIN") {
            return {
                code: 0,
                message: "无法连接到服务器，或者链接超时！"
            };
        } else if (xhr.responseText && xhr.responseText.indexOf("<!DOCTYPE") != -1) {
            return {
                code: xhr.status || 500,
                message: "服务器错误"
            };
        } else {
            return {
                code: xhr.statusText === "NO-LOGIN" ? "401" : xhr.status,
                message: (xhr.responseText || xhr.statusText) === "NO-LOGIN" ? "你还未登录，或者登录已超时，请重新登录！" : (xhr.responseText || xhr.statusText)
            };
        }
    } else {
        return {
            code: "未知",
            message: "未知错误"
        };
    }
};

/**
 * 根据API配置创建一个可发送request的函数
 *
 * @param {any} apiName api name
 * @param {any} checkResolve 判断请求返回的的结果是通过的函数
 * @param {any} transformResolve 转换返回的结果为通过函数使用的数据
 * @param {any} transformReject 转换返回的结果为拒绝函数使用的数据
 * @returns
 */
function createApiRequest(apiName, checkResolve, transformResolve, transformReject) {
    checkResolve = typeof checkResolve === "function" ? checkResolve : defaultCheckResolve;
    transformResolve = typeof transformResolve === "function" ? transformResolve : defaultTransformResolve;
    transformReject = typeof transformReject === "function" ? transformReject : defaultTransformReject;
    return function (dataModel, otherAjaxOptions, filterResolveDate) {
        var ops = getApiOptions(apiName, otherAjaxOptions, dataModel);
        // ops.headers = typeof ops.headers === 'undefined'?{}:ops.headers;
        // ops.headers.langCode ="xxxxxx";
        ops.checkResolve = checkResolve;
        ops.transformResolve = transformResolve;
        ops.transformReject = transformReject;
        return sendApiRequest(ops, filterResolveDate);
    }
}

function sendApiRequest(requestOptions, filterResolveDate) {
    var ops = requestOptions,
        checkResolve = typeof ops.checkResolve === "function" ? ops.checkResolve : defaultCheckResolve,
        transformResolve = typeof ops.transformResolve === "function" ? ops.transformResolve : defaultTransformResolve,
        transformReject = typeof ops.transformReject === "function" ? ops.transformReject : defaultTransformReject;

    return new Promise(function (resolve, reject) {
        axios.request(ops).then(function (response) {
            var data = response.data,
                rejectData = transformReject(data, response),
                resolveData = transformResolve(data, response);
            if (checkResolve(data, response) === false) {
                reject(rejectData);
            } else {
                if (typeof filterResolveDate === "function") {
                    resolveData = filterResolveDate(resolveData);
                }
                resolve(resolveData);
            }
        }).catch(function (error) {
            reject(error);
        });
    });
}

function getApiReturnMessage(apiReturnData) {
    if (apiReturnData && apiReturnData.message) {
        return apiReturnData.message;
    }
}

function getApiErrorMessage(apiReturnData) {
    return "错误码：" + (apiReturnData ? apiReturnData.code || "未知" : "未知") + "<br />错误消息：" + (getApiReturnMessage(apiReturnData) || "未知错误");
}

exports.getApiOptions = getApiOptions;
exports.createApiRequest = createApiRequest;
exports.getApiReturnMessage = getApiReturnMessage;
exports.getApiErrorMessage = getApiErrorMessage;
exports.sendApiRequest = sendApiRequest;

exports.convertDateTimeStamp = function (str) {
    var date = new Date(),
        arr = str.split("-"),
        day = arr[2],
        haveTime = day.indexOf(":") !== -1;
    date.setFullYear(arr[0]);
    date.setMonth(parseInt(arr[1]) - 1);
    if (haveTime) {
        var time = day.substr(day.indexOf(" ")),
            arrTime = time.split(":"),
            hour = arrTime[0],
            min = arrTime[1],
            sec = arrTime[2];
        day = day.substr(0, day.indexOf(" "));
        hour = parseInt(hour);
        hour = isNaN(hour) ? 0 : hour;
        hour = hour > 0 ? hour - 1 : hour;
        date.setHours(hour);

        min = parseInt(min);
        min = isNaN(min) ? 0 : min;
        min = min > 0 ? min - 1 : min;
        date.setMinutes(min);

        sec = parseInt(sec);
        sec = isNaN(sec) ? 0 : sec;
        sec = sec > 0 ? sec - 1 : sec;
        date.setSeconds(sec);
    }
    day = parseInt(day) - 1;
    date.setDate(day);
    return date.getTime();
}