/**
 * Created by likaituan on 16/6/22.
 */

define(function (req, exp) {
    "use strict";
    var $ = req("sys.filter");
    $.local = localStorage;
    $.session = sessionStorage;

    //编译函数
    exp.compileFun = function (tplFun) {
        return function (data) {
            return tplFun.call(data, $);
        };
    };

});
