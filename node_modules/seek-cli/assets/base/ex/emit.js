/**
 * Created by gao on 15/12/1.
 */
define(function(req, exp, mod){
    "use strict";
    var ajax = req("sys.query").ajax;
    var config = req("root.config");
    var obj = req("sys.object");
    var testData = {};

    //发送
    mod.exports = function(uri){
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
                url: config.baseUri + uri,
                type: "post",
                data: obj.filter(params, "typeof($item) != 'object'"),
                success: successCallback
            });

        }
    };

});
