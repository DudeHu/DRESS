/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";
    exp.curSpace = 0;
    exp.space = 500;
    exp.onInit = function () {
        exp.curSpace = 0;
        exp.space = sessionStorage.space;
    }
    exp.exit = function () {
        sessionStorage.clear();
        exp.go("login");
    }
});