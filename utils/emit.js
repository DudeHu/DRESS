/**
 * 统一发送service
 * Created by likaituan on 15/7/31.
 */

define(function(req, exp, mod){
    "use strict";
    var ajax = req("jquery").ajax;
    var filter = req("sys.filter");
    var config = req("root.config");
    var testData = req("utils.testData");

    var host = "";

    //发送
    mod.exports = function(uri, path){
        path = path || "service";

        return function(params, callback) {
            if(arguments.length==1){
                callback = params;
                params = {};
            }
            var successCallback = config.ajaxRes(callback, params);
            if(testData[uri]) {
                return successCallback(testData[uri]);
            }
            ajax({
                url: "/" + path + "/" + uri,
                type: "post",
                data: filter.filter(params, "typeof($item) != 'object'"),
                success: successCallback
            });
        }
    };

});